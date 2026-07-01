import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, AlertTriangle, Lightbulb, PenLine, Layers, Brain } from 'lucide-react';
import formulaData from '../data/formulas.json';
import BookmarkButton from '../components/BookmarkButton';
import useBookmarks from '../hooks/useBookmarks';

const IMPORTANCE_STYLE = {
  High: 'bg-accent/15 text-accent',
  Medium: 'bg-primary/15 text-primary',
  Low: 'bg-gray-500/15 text-gray-400',
};

function Section({ title, icon: Icon, children, accent, warning }) {
  const iconColor = warning ? 'text-red-400' : accent ? 'text-accent' : 'text-primary';
  return (
    <div className="mb-6">
      <h3 className="flex items-center gap-2 text-white text-sm font-semibold mb-3">
        <Icon size={16} className={iconColor} /> {title}
      </h3>
      {children}
    </div>
  );
}

export default function FormulaDetail({ preview }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const formula = formulaData.formulas.find((f) => f.id === id);

  if (!formula) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-white text-lg font-semibold mb-2">Formula not found</p>
        <button onClick={() => navigate('/')} className="text-primary text-sm hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Public preview mode — shown to non-logged-in users via /formula/:id/preview
  if (preview) {
    return (
      <div className="min-h-screen bg-darkbg">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/20 rounded-3xl p-6 mb-6">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${IMPORTANCE_STYLE[formula.satImportance]}`}>
              {formula.satImportance} Priority
            </span>
            <h1 className="text-white text-2xl font-bold mt-4 mb-3">{formula.name}</h1>
            <p className="text-primary font-mono text-xl bg-darkbg/40 rounded-xl px-4 py-3 inline-block">
              {formula.equation}
            </p>
          </div>
          <p className="text-gray-300 mb-8 leading-relaxed">{formula.easyExplanation}</p>
          <div className="bg-surface border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-white font-semibold mb-2">
              See the full explanation, memory tricks, and practice questions
            </p>
            <p className="text-gray-500 text-sm mb-4">Free with a CODEbridge Formulas account</p>

            href="/signup"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
            Get Started Free →
          </a>
        </div>
      </div>
      </div >
    );
  }

  const isBookmarked = bookmarks.includes(formula.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header card */}
        <div className="bg-gradient-to-br from-primary/15 to-secondary/15 border border-primary/20 rounded-3xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${IMPORTANCE_STYLE[formula.satImportance]}`}>
              {formula.satImportance} Priority
            </span>
            <BookmarkButton isBookmarked={isBookmarked} onToggle={() => toggleBookmark(formula.id)} size={20} />
          </div>
          <h1 className="text-white text-2xl font-bold mb-3">{formula.name}</h1>
          <p className="text-primary font-mono text-xl bg-darkbg/40 rounded-xl px-4 py-3 inline-block">
            {formula.equation}
          </p>
        </div>

        <Section title="Explanation" icon={Brain}>
          <p className="text-gray-300 leading-relaxed">{formula.explanation}</p>
        </Section>

        <Section title="In Plain English" icon={Lightbulb} accent>
          <p className="text-white leading-relaxed">{formula.easyExplanation}</p>
        </Section>

        <Section title="Example Problem" icon={PenLine}>
          <p className="text-gray-300 mb-3">{formula.exampleProblem}</p>
          <ol className="space-y-2">
            {formula.stepByStepSolution.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="shrink-0 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-300 font-mono">{step}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Common Mistakes" icon={AlertTriangle} warning>
          <ul className="space-y-2">
            {formula.commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-300">
                <span className="text-red-400 shrink-0">×</span> {m}
              </li>
            ))}
          </ul>
        </Section>

        <div className="bg-accent/10 border border-accent/25 rounded-2xl p-5 mb-6">
          <p className="text-accent text-xs font-semibold uppercase tracking-wide mb-2">Memory Trick</p>
          <p className="text-white text-sm leading-relaxed">{formula.memoryTrick}</p>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-5 mb-6">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Layers size={13} /> Practice Question
          </p>
          <p className="text-white text-sm">{formula.practiceQuestion}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {formula.tags.map((tag) => (
            <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}