import { motion } from 'framer-motion';
import BookmarkButton from './BookmarkButton';

const MASTERY_DOT = {
  new: null,
  learning: 'bg-yellow-400',
  reviewing: 'bg-primary',
  mastered: 'bg-accent',
};

export default function FormulaCard({ formula, isBookmarked, onToggleBookmark, onClick, mastery }) {
  const importanceColor = {
    High: 'bg-accent/15 text-accent',
    Medium: 'bg-primary/15 text-primary',
    Low: 'bg-gray-500/15 text-gray-400',
  }[formula.satImportance] || 'bg-gray-500/15 text-gray-400';

  const dotColor = mastery ? MASTERY_DOT[mastery] : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-surface border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-primary/40 transition-colors relative"
    >
      {dotColor && (
        <span className={`absolute top-3 right-3 w-2 h-2 rounded-full ${dotColor}`} title={`Mastery: ${mastery}`} />
      )}
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${importanceColor}`}>
          {formula.satImportance} Priority
        </span>
        <BookmarkButton isBookmarked={isBookmarked} onToggle={() => onToggleBookmark(formula.id)} />
      </div>
      <h3 className="text-white font-semibold text-lg">{formula.name}</h3>
      <p className="text-primary font-mono mt-1">{formula.equation}</p>
      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{formula.easyExplanation}</p>
      <div className="flex gap-2 mt-3">
        {formula.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-md">
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
