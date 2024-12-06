export interface WordChain {
  word: string;
  definition: string;
  definitions?: string[];
  synonyms: string[];
}

export interface GameState {
  currentChain: WordChain[];
  nextWordHint: string;
  score: number;
  gameOver: boolean;
  timeLeft: number;
  startWord: string;
  missedWord?: string;
  missedWordDefinition?: string;
  isChainComplete?: boolean;
}

export interface GameHistory {
  id: string;
  date: string;
  startWord: string;
  score: number;
  chain: WordChain[];
  missedWord?: string;
  missedWordDefinition?: string;
  isChainComplete?: boolean;
}

export type Page = 'game' | 'history' | 'how-to-play' | 'privacy' | 'contact';
