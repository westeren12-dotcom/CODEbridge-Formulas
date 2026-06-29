import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, RotateCcw, Home, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import formulaData from '../data/formulas.json';
import QuizMode from '../components/QuizMode';
import BadgeToast from '../components/BadgeToast';
import { useProgress } from '../context/ProgressContext';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function Quiz() {
  const [stage, setStage] = useState('select');
  const [difficulty, setDifficulty] = useState('All');
  const [result, setResult] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const { recordQuizResult } = useProgress();

  const pool = difficulty === 'All' ? formulaData.formulas : formulaData.formulas.filter((f) => f.difficulty === difficulty);

  const handleComplete = async (res) => {
    setResult(res);
    setStage('results');
    const { earnedBadges: newBadges } = await recordQuizResult(res.score, res.total);
    if (newBadges?.length) {
      setEarnedBadges(newBadges);
      setTimeout(() => setEarnedBadges([]), 4500);
    }
  };

  const retry = () => {
    setResult(null);
    setStage('playing');
  };

  const accuracy = result ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <BadgeToast badges={earnedBadges} />

      <AnimatePresence mode="wait">
        {stage === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <h1 className="text-white text-2xl font-bold mb-2">Timed Quiz</h1>
            <p className="text-gray-400 text-sm mb-8">Pick a difficulty. Each question gives you 20 seconds.</p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                    difficulty === d ? 'bg-primary border-primary text-white' : 'border-white/10 text-gray-400 hover:border-primary/40'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-gray-500 text-xs mb-8">{pool.length} question{pool.length !== 1 ? 's' : ''} in this set</p>
            <button
              onClick={() => setStage('playing')}
              disabled={pool.length === 0}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Start Quiz
            </button>
          </motion.div>
        )}

        {stage === 'playing' && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <QuizMode formulas={pool} timeLimit={20} onComplete={handleComplete} />
          </motion.div>
        )}

        {stage === 'results' && result && (
          <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mb-5">
              <Trophy size={36} className="text-white" />
            </div>
            <h1 className="text-white text-2xl font-bold mb-1">{accuracy >= 70 ? 'Nice work!' : 'Keep practicing!'}</h1>
            <p className="text-gray-400 text-sm mb-6">You scored {result.score} / {result.total} ({accuracy}% accuracy)</p>

            <div className="flex justify-center gap-3 mb-8">
              <button onClick={retry} className="flex items-center gap-2 border border-white/10 hover:border-primary/40 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
                <RotateCcw size={15} /> Retry
              </button>
              <Link to="/" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
                <Home size={15} /> Dashboard
              </Link>
            </div>

            <div className="text-left space-y-2">
              <h3 className="text-gray-400 text-xs uppercase tracking-wide mb-3">Review</h3>
              {result.history.map((h, i) => (
                <div key={i} className="flex items-start gap-3 bg-surface border border-white/5 rounded-xl px-4 py-3">
                  {h.correct ? <Check size={16} className="text-accent shrink-0 mt-0.5" /> : <X size={16} className="text-red-400 shrink-0 mt-0.5" />}
                  <div className="min-w-0">
                    <p className="text-white text-sm">{h.name}</p>
                    {!h.correct && (
                      <p className="text-gray-500 text-xs mt-0.5">
                        Correct answer: <span className="text-accent font-mono">{h.answer}</span>
                        {h.chosen && <> · You chose: <span className="text-red-400 font-mono">{h.chosen}</span></>}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}   