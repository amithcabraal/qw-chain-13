import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuButton } from './MenuButton';
import { MenuItems } from './MenuItems';
import { Toast } from '../Toast';
import { toggleFullscreen } from '../../utils/fullscreen';
import { startCasting } from '../../utils/casting';
import { shareGame } from '../../utils/share';
import type { Page } from '../../types';
import type { GameState } from '../../types';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  gameState: GameState;
}

export function Navigation({ currentPage, onPageChange, gameState }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFullscreen = async () => {
    try {
      await toggleFullscreen();
    } catch (err) {
      setError('Fullscreen mode is not available in this browser');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCast = async () => {
    try {
      await startCasting();
    } catch (err) {
      setError('Casting is not available in this browser');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleShare = async () => {
    try {
      await shareGame(gameState);
      setSuccess('Game details copied to clipboard!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error && err.message === 'Game details copied to clipboard!') {
        setSuccess(err.message);
      } else {
        setError('Failed to share game');
      }
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
    }
  };

  return (
    <>
      <div className="relative z-50">
        <MenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-emerald-900 shadow-lg overflow-hidden"
            >
              <MenuItems
                currentPage={currentPage}
                onPageChange={onPageChange}
                onClose={() => setIsOpen(false)}
                onFullscreen={handleFullscreen}
                onCast={handleCast}
                onShare={handleShare}
                gameState={gameState}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <Toast
            message={error}
            isVisible={true}
            onClose={() => setError(null)}
            type="error"
          />
        )}
        {success && (
          <Toast
            message={success}
            isVisible={true}
            onClose={() => setSuccess(null)}
            type="success"
          />
        )}
      </AnimatePresence>
    </>
  );
}