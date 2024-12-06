import { GameState } from '../types';

export const isShareAvailable = (): boolean => {
  return !!navigator.share || !!navigator.clipboard;
};

export const shareGame = async (gameState: GameState): Promise<void> => {
  const shareText = `🎮 QuizWordz Chain\n🎯 Score: ${gameState.score}\n🎲 Start word: "${gameState.startWord}"\n📝 Chain length: ${gameState.currentChain.length} words\n\nCan you beat my score? Play now!`;
  
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'QuizWordz Chain',
        text: shareText,
        url: window.location.href
      });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      throw new Error('Game details copied to clipboard!');
    } else {
      throw new Error('Sharing is not available in this browser');
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'Game details copied to clipboard!') {
      throw err;
    }
    console.error('Error sharing:', err);
    throw new Error('Failed to share game');
  }
};