import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X } from 'lucide-react';
import { useState } from 'react';
import { useProgress } from '../context/ProgressContext';

export default function StreakBanner() {
  const { streak, lastStudyDate } = useProgress();
  const [dismissed, setDismissed] = useState(false);

  const studiedToday = lastStudyDate === new Date().toDateString();
  if (streak <= 0 || studiedToday || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center justify-between gap-3 bg-orange-500/10 border border-orange-500/30 rounded-2xl px-4 py-3 mb-6"
      >
        <div className="flex items-center gap-3">
          <Flame size={20} className="text-orange-400" fill="currentColor" />
          <p className="text-sm text-orange-300">
            <span className="font-semibold">{streak}-day streak</span> — study today to keep it alive!
          </p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-orange-400/60 hover:text-orange-300">
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}