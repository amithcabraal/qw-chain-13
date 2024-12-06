import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'error' | 'success';
}

export function Toast({ message, isVisible, onClose, type = 'error' }: ToastProps) {
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-emerald-500';
  const hoverColor = type === 'error' ? 'hover:bg-red-600' : 'hover:bg-emerald-600';
  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2`}>
            <Icon className="w-5 h-5" />
            <span>{message}</span>
            <button
              onClick={onClose}
              className={`ml-2 p-1 ${hoverColor} rounded-full transition-colors`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}