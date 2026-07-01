import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RotateCcw } from 'lucide-react';
import useKeyboard from '../hooks/useKeyboard';

const MASTERY_STYLES = {
  new: 'bg-gray-500/15 text-gray-400',
  learning: 'bg-yellow-500/15 text-yellow-400',
  reviewing: 'bg-primary/15 text-primary',
  mastered: 'bg-accent/15 text-accent',
};
const MASTERY_TEXT = { new: 'New', learning: 'Learning', reviewing: 'Reviewing', mastered: 'Mastered' };

export default function FlashcardMode({ queue, getMastery, onReview, onFinished }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!queue || queue.length === 0) return null;
  const formula = queue[index];
  if (!formula) return null;

  const mastery = getMastery(formula.id);

  const handleReview = (knewIt) => {
    onReview(formula.id, knewIt);
    setFlipped(false);
    if (index + 1 < queue.length) setIndex((i) => i + 1);
    else onFinished?.();
  };

  // Keyboard shortcuts: Space = flip, → = Got it, ← = Still learning
  useKeyboard({
    ' ': () => setFlipped((f) => !f),
    Space: () => setFlipped((f) => !f),
    ArrowRight: () => { if (flipped) handleReview(true); },
    ArrowLeft: () => { if (flipped) handleReview(false); },
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${MASTERY_STYLES[mastery]}`}>
          {MASTERY_TEXT[mastery]}
        </span>
        <span className="text-gray-500 text-xs">Card {index + 1} of {queue.length}</span>
      </div>

      <p className="text-gray-600 text-xs text-center">
        Space = flip &nbsp;·&nbsp; ← Still learning &nbsp;·&nbsp; → Got it
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={formula.id + flipped}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setFlipped((f) => !f)}
          className="w-full max-w-md h-72 bg-surface border border-white/10 rounded-3xl flex items-center justify-center p-8 cursor-pointer text-center shadow-xl"
        >
          {!flipped ? (
            <div>
              <p className="text-gray-400 text-sm mb-2">{formula.name}</p>
              <p className="text-2xl font-mono text-primary">{formula.equation}</p>
              <p className="text-gray-500 text-xs mt-4">Tap to reveal explanation</p>
            </div>
          ) : (
            <div>
              <p className="text-white">{formula.easyExplanation}</p>
              <p className="text-gray-500 text-xs mt-4">Did you know this one?</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {!flipped ? (
        <button
          onClick={() => setFlipped(true)}
          className="text-gray-400 text-sm hover:text-white flex items-center gap-1.5"
        >
          <RotateCcw size={14} /> Flip card
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={() => handleReview(false)}
            className="flex items-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <X size={16} /> Still learning
          </button>
          <button
            onClick={() => handleReview(true)}
            className="flex items-center gap-2 border border-accent/30 text-accent hover:bg-accent/10 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <Check size={16} /> Got it
          </button>
        </div>
      )}
    </div>
  );
}