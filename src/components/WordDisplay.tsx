import { motion, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';
import { WordDefinitions } from './WordDefinitions';

interface WordDisplayProps {
  currentWord: {
    word: string;
    definition: string;
    definitions?: string[];
  };
  error?: string | null;
  isFirstWord?: boolean;
}

export function WordDisplay({ currentWord, error, isFirstWord = false }: WordDisplayProps) {
  const definitions = currentWord.definitions || [currentWord.definition];
  const label = isFirstWord ? "First Word" : "Previous Word";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg space-y-6"
    >
      <div className="p-6 rounded-xl bg-emerald-800/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-100">
            {label}: {currentWord.word}
          </h2>
        </div>
        <WordDefinitions definitions={definitions} />
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            key={error}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="p-4 rounded-lg bg-red-500/20 text-red-800 dark:text-red-200 text-center font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}