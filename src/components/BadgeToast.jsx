import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';

export default function BadgeToast({ badges }) {
  if (!badges?.length) return null;
  return (
    <div className="fixed top-20 right-4 z-50 space-y-3">
      <AnimatePresence>
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-center gap-3 bg-surface border border-accent/40 rounded-2xl px-4 py-3 shadow-xl shadow-accent/10 max-w-xs"
          >
            <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
              <Award size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Badge Earned!</p>
              <p className="text-gray-400 text-xs">{badge.label} — {badge.description}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}