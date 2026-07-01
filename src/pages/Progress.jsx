import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, TrendingUp, Award, Flame, BookOpen, Brain } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import useFormulaProgress from '../hooks/useFormulaProgress';
import { useProgress } from '../context/ProgressContext';
import formulaData from '../data/formulas.json';

const MASTERY_COLORS = {
  mastered: '#22C55E',
  reviewing: '#4F7CFF',
  learning: '#EAB308',
  new: '#374151',
};

export default function Progress() {
  const navigate = useNavigate();
  const { progress, loading } = useFormulaProgress();
  const { streak, stats, badges } = useProgress();
  const total = formulaData.formulas.length;

  const masteryData = useMemo(() => {
    const counts = { mastered: 0, reviewing: 0, learning: 0, new: 0 };
    formulaData.formulas.forEach((f) => {
      const m = progress[f.id]?.mastery || 'new';
      counts[m] = (counts[m] || 0) + 1;
    });
    return [
      { name: 'Mastered', value: counts.mastered, color: MASTERY_COLORS.mastered },
      { name: 'Reviewing', value: counts.reviewing, color: MASTERY_COLORS.reviewing },
      { name: 'Learning', value: counts.learning, color: MASTERY_COLORS.learning },
      { name: 'New', value: counts.new, color: MASTERY_COLORS.new },
    ];
  }, [progress]);

  const masteredCount = masteryData.find((d) => d.name === 'Mastered')?.value || 0;
  const masteryPct = Math.round((masteredCount / total) * 100);
  const accuracy = stats?.quizzesTaken > 0
    ? Math.round((stats.quizzesPassed / stats.quizzesTaken) * 100)
    : 0;

  const radialData = [{ name: 'Mastery', value: masteryPct, fill: '#4F7CFF' }];

  if (loading) {
    return <div className="text-gray-500 text-center py-20">Loading your stats...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6">
        <ChevronLeft size={16} /> Back
      </button>
      <h1 className="text-white text-2xl font-bold mb-1">Your Progress</h1>
      <p className="text-gray-500 text-sm mb-8">Everything you've achieved so far.</p>

      {/* Top stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Flame, label: 'Day Streak', value: streak, color: 'text-orange-400' },
          { icon: Brain, label: 'Quizzes Taken', value: stats?.quizzesTaken || 0, color: 'text-primary' },
          { icon: TrendingUp, label: 'Quiz Accuracy', value: `${accuracy}%`, color: 'text-accent' },
          { icon: Award, label: 'Badges', value: badges?.length || 0, color: 'text-secondary' },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-surface border border-white/10 rounded-2xl p-4 text-center"
          >
            <Icon size={18} className={`${color} mx-auto mb-1.5`} />
            <p className="text-white font-bold text-xl">{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Mastery radial */}
      <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="65%"
              outerRadius="100%"
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar background={{ fill: '#ffffff08' }} dataKey="value" cornerRadius={8} max={100} />
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="text-white font-bold text-2xl text-center -mt-24 relative">{masteryPct}%</p>
          <p className="text-gray-500 text-xs text-center mt-16 relative">Mastered</p>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold mb-3">Formula Mastery</h3>
          <div className="space-y-2">
            {masteryData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-400 text-sm">{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(d.value / total) * 100}%`, background: d.color }}
                    />
                  </div>
                  <span className="text-gray-500 text-xs w-5 text-right">{d.value}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-3">{total} total formulas</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-surface border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <BookOpen size={16} className="text-primary" /> By Topic
        </h3>
        {[
          { tag: 'algebra', label: 'Algebra' },
          { tag: 'geometry', label: 'Geometry' },
          { tag: 'trigonometry', label: 'Trigonometry' },
          { tag: 'statistics', label: 'Statistics' },
          { tag: 'sequences', label: 'Sequences' },
        ].map(({ tag, label }) => {
          const inCategory = formulaData.formulas.filter((f) => f.tags.some((t) => t === tag));
          const masteredInCat = inCategory.filter((f) => progress[f.id]?.mastery === 'mastered').length;
          const pct = inCategory.length > 0 ? Math.round((masteredInCat / inCategory.length) * 100) : 0;
          return (
            <div key={tag} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{label}</span>
                <span className="text-gray-500">{masteredInCat}/{inCategory.length}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}