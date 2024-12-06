import { motion } from 'framer-motion';
import { Share2, Trophy, XCircle, CheckCircle2 } from 'lucide-react';
import { WordDefinitions } from './WordDefinitions';
import type { WordChain } from '../types';

interface GameOverProps {
  score: number;
  chain: WordChain[];
  onRestart: () => void;
  startWord: string;
  missedWord?: string;
  missedWordDefinition?: string;
  isChainComplete?: boolean;
}

export function GameOver({ 
  score, 
  chain, 
  onRestart, 
  startWord, 
  missedWord,
  missedWordDefinition,
  isChainComplete
}: GameOverProps) {
  const handleShare = () => {
    const text = `🎮 QuidzWordz Chain\n🎯 Score: ${score}\n🎲 Start word: "${startWord}"\n${isChainComplete ? '🌟 Completed the chain!' : ''}\nCan you beat my score? Play at [URL]`;
    navigator.clipboard.writeText(text);
  };

  const reversedChain = [...chain].reverse();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg p-6 rounded-xl bg-white/90 dark:bg-emerald-800/20 backdrop-blur-sm shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-100">
          {isChainComplete ? 'Chain Complete!' : 'Game Over!'}
        </h2>
        {isChainComplete ? (
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Trophy className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-xl text-emerald-800 dark:text-emerald-100">Final Score: {score}</p>
        <p className="text-emerald-600 dark:text-emerald-100/80">Words in chain: {chain.length}</p>
      </div>

      {!isChainComplete && missedWord && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-500/10">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-200">You missed:</p>
          </div>
          <p className="text-xl font-semibold text-red-800 dark:text-red-100 mb-2">{missedWord}</p>
          {missedWordDefinition && missedWordDefinition !== 'Unable to fetch definition' && (
            <WordDefinitions 
              definitions={[missedWordDefinition]} 
              variant="game-over" 
            />
          )}
        </div>
      )}

      {isChainComplete && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
          <p className="text-emerald-700 dark:text-emerald-200">
            Congratulations! You've found all possible synonyms in this chain!
          </p>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-100">
          Your Word Chain:
        </h3>
        {reversedChain.map((item, index) => (
          <div key={index} className="p-3 rounded bg-emerald-50 dark:bg-emerald-900/20">
            <p className="font-medium text-emerald-800 dark:text-emerald-100 mb-2">
              {item.word}
            </p>
            <WordDefinitions 
              definitions={item.definitions || [item.definition]} 
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-emerald-100 dark:bg-emerald-700/50 hover:bg-emerald-200 dark:hover:bg-emerald-700/70 rounded-lg text-emerald-700 dark:text-white flex items-center gap-2 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </motion.div>
  );
}