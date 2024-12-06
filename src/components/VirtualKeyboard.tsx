import { motion } from 'framer-motion';
import { Send, Delete } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  submitDisabled?: boolean;
  guessedVowels: string[];
}

export function VirtualKeyboard({ 
  onKeyPress, 
  onBackspace,
  onSubmit,
  disabled = false,
  submitDisabled = false,
  guessedVowels
}: VirtualKeyboardProps) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];

  return (
    <div className="w-full mt-4 px-1">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center gap-2 mb-4"
      >
        {vowels.map((vowel) => (
          <button
            key={vowel}
            onClick={() => onKeyPress(vowel)}
            disabled={disabled}
            className="w-16 h-16 rounded-lg text-2xl font-medium transition-colors bg-emerald-100 dark:bg-emerald-800/80 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-200 dark:hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {vowel}
          </button>
        ))}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center gap-4"
      >
        <button
          onClick={onBackspace}
          disabled={disabled || guessedVowels.length === 0}
          className="w-32 h-12 rounded-lg bg-emerald-200 dark:bg-emerald-700/80 text-emerald-900 dark:text-emerald-100 hover:bg-emerald-300 dark:hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
        >
          <Delete className="w-5 h-5" />
          <span className="inline">Backspace</span>
        </button>

        <button
          onClick={onSubmit}
          disabled={disabled || submitDisabled}
          className="w-32 h-12 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center gap-2 transition-colors"
        >
          <Send className="w-5 h-5" />
          <span className="inline">Submit</span>
        </button>
      </motion.div>
    </div>
  );
}