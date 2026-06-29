import { Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookmarkButton({ isBookmarked, onToggle, size = 18 }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`transition-colors ${isBookmarked ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Bookmark size={size} fill={isBookmarked ? '#4F7CFF' : 'none'} />
    </motion.button>
  );
}