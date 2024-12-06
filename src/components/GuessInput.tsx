import { useState } from 'react';
import { VirtualKeyboard } from './VirtualKeyboard';

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
  nextWordHint: string;
  guessedVowels: string[];
}

export function GuessInput({ onGuess, disabled = false, nextWordHint, guessedVowels }: GuessInputProps) {
  const [guessedPositions, setGuessedPositions] = useState<Array<{ vowel: string; position: number }>>([]);

  const handleSubmit = () => {
    const guessedWord = [...nextWordHint.toLowerCase()].map((char, index) => {
      const guessedVowel = guessedPositions.find(p => p.position === index);
      return guessedVowel ? guessedVowel.vowel : char;
    }).join('');

    onGuess(guessedWord);
    setGuessedPositions([]);
  };

  const handleKeyPress = (key: string) => {
    const vowelPositions = [...nextWordHint.toLowerCase()].map((char, index) => 
      /[aeiou]/.test(char) ? index : -1
    ).filter(pos => pos !== -1);

    if (vowelPositions.length > 0) {
      const existingPositions = new Set(guessedPositions.map(p => p.position));
      const nextPosition = vowelPositions.find(pos => !existingPositions.has(pos));

      if (nextPosition !== undefined) {
        setGuessedPositions(prev => [...prev, { vowel: key, position: nextPosition }]);
      }
    }
  };

  const handleBackspace = () => {
    setGuessedPositions(prev => prev.slice(0, -1));
  };

  const displayWord = [...nextWordHint.toLowerCase()].map((char, index) => {
    if (/[aeiou]/.test(char)) {
      const guessedVowel = guessedPositions.find(p => p.position === index);
      return (
        <span key={index} className={`${
          guessedVowel 
            ? 'text-emerald-500 dark:text-emerald-400'
            : 'text-emerald-800 dark:text-emerald-100'
        }`}>
          {guessedVowel ? guessedVowel.vowel : '_'}
        </span>
      );
    }
    return (
      <span key={index} className="text-emerald-800 dark:text-emerald-100">
        {char}
      </span>
    );
  });

  const allVowelsFilled = guessedPositions.length === [...nextWordHint].filter(char => /[aeiou]/.test(char)).length;

  return (
    <div className="w-full max-w-lg mt-6">
      <div className="mb-4 text-center">
        <p className="text-3xl font-mono tracking-wider flex justify-center gap-1">
          {displayWord}
        </p>
      </div>

      <VirtualKeyboard
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSubmit={handleSubmit}
        disabled={disabled}
        submitDisabled={!allVowelsFilled}
        guessedVowels={guessedPositions.map(p => p.vowel)}
      />
    </div>
  );
}