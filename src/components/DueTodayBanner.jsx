import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

export default function DueTodayBanner({ dueCount }) {
  const navigate = useNavigate();
  if (!dueCount || dueCount === 0) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate('/flashcards')}
      className="w-full flex items-center justify-between bg-secondary/10 border border-secondary/30 rounded-2xl px-4 py-3 mb-6 hover:border-secondary/50 transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
          <Layers size={17} className="text-secondary" />
        </div>
        <div>
          <p className="text-white text-sm font-semibold">
            {dueCount} formula{dueCount !== 1 ? 's' : ''} due for review
          </p>
          <p className="text-gray-500 text-xs">Tap to start your flashcard session</p>
        </div>
      </div>
      <span className="text-secondary text-sm font-semibold shrink-0">Review →</span>
    </motion.button>
  );
}