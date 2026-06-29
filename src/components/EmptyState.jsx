import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Icon size={24} className="text-gray-500" />
        </div>
      )}
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-xs">{description}</p>}
      {action}
    </motion.div>
  );
}