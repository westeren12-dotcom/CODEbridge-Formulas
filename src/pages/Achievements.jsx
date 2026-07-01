import { motion } from 'framer-motion';
import { ChevronLeft, Award, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgress, BADGE_DEFINITIONS } from '../context/ProgressContext';

export default function Achievements() {
  const navigate = useNavigate();
  const { badges, streak, stats } = useProgress();

  const liveStats = {
    quizzesTaken: stats?.quizzesTaken || 0,
    quizzesPassed: stats?.quizzesPassed || 0,
    streak,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6">
        <ChevronLeft size={16} /> Back
      </button>

      <h1 className="text-white text-2xl font-bold mb-1">Achievements</h1>
      <p className="text-gray-500 text-sm mb-8">
        {badges.length} of {BADGE_DEFINITIONS.length} unlocked
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {BADGE_DEFINITIONS.map((badge, i) => {
          const earned = badges.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-4 rounded-2xl p-5 border transition-colors ${
                earned ? 'bg-accent/10 border-accent/30' : 'bg-surface border-white/10'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                earned ? 'bg-accent/20' : 'bg-white/5'
              }`}>
                {earned ? <Award size={22} className="text-accent" /> : <Lock size={18} className="text-gray-600" />}
              </div>
              <div>
                <p className={`font-semibold text-sm ${earned ? 'text-white' : 'text-gray-500'}`}>
                  {badge.label}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{badge.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}