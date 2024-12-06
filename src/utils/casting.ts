declare global {
  interface Window {
    __onGCastApiAvailable?: (isAvailable: boolean) => void;
    chrome?: {
      cast?: {
        isAvailable?: boolean;
        initialize: (config: any, successCallback: () => void, errorCallback: (error: Error) => void) => void;
        SessionRequest: new (appId: string) => any;
        ApiConfig: new (sessionRequest: any, sessionListener: (session: any) => void, receiverListener: (availability: string) => void, autoJoinPolicy: any) => any;
        ReceiverAvailability: { AVAILABLE: string };
        AutoJoinPolicy: { ORIGIN_SCOPED: any };
        requestSession: (successCallback: (session: any) => void, errorCallback: (error: Error) => void) => void;
        media: {
          DEFAULT_MEDIA_RECEIVER_APP_ID: string;
          MediaInfo: new (contentUrl: string, contentType: string) => any;
          GenericMediaMetadata: new () => any;
          LoadRequest: new (mediaInfo: any) => any;
        };
      };
    };
  }
}

let castingInitialized = false;

export const isCastingAvailable = (): boolean => {
  return !!(window?.chrome?.cast?.isAvailable);
};

export const initializeCasting = async (): Promise<void> => {
  if (castingInitialized || !window.chrome?.cast) {
    return;
  }

  return new Promise((resolve) => {
    if (!window.chrome?.cast?.isAvailable) {
      window.__onGCastApiAvailable = (isAvailable: boolean) => {
        if (isAvailable) {
          initCastApi();
        }
      };
      return;
    }

    function initCastApi() {
      const { cast } = window.chrome;
      if (!cast) return;

      const sessionRequest = new cast.SessionRequest(
        cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID
      );
      
      const apiConfig = new cast.ApiConfig(
        sessionRequest,
        (session: any) => {
          console.log('Cast session started:', session);
        },
        (availability: string) => {
          castingInitialized = availability === cast.ReceiverAvailability.AVAILABLE;
          if (castingInitialized) {
            resolve();
          }
        },
        cast.AutoJoinPolicy.ORIGIN_SCOPED
      );

      cast.initialize(apiConfig, 
        () => {
          console.log('Cast initialized successfully');
          resolve();
        }, 
        (error: Error) => {
          console.error('Cast initialization error:', error);
          resolve();
        }
      );
    }

    initCastApi();
  });
};

export const startCasting = async (): Promise<void> => {
  if (!isCastingAvailable()) {
    throw new Error('Casting is not available');
  }

  const { cast } = window.chrome!;
  if (!cast) throw new Error('Cast API not available');
  
  return new Promise((resolve, reject) => {
    cast.requestSession(
      (session: any) => {
        const mediaInfo = new cast.media.MediaInfo(
          window.location.href,
          'text/html'
        );
        mediaInfo.metadata = new cast.media.GenericMediaMetadata();
        mediaInfo.metadata.title = 'QuizWordz Chain';
        
        const request = new cast.media.LoadRequest(mediaInfo);
        
        session.loadMedia(request)
          .then(() => {
            console.log('Cast media loaded successfully');
            resolve();
          })
          .catch((error: Error) => {
            console.error('Cast media load error:', error);
            reject(error);
          });
      },
      (error: Error) => {
        console.error('Cast session request error:', error);
        reject(error);
      }
    );
  });
};