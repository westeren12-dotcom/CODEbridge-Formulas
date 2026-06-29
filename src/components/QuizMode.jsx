import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestions(formulas) {
  return shuffle(formulas).map((formula) => {
    const wrongOptions = shuffle(formulas.filter((f) => f.id !== formula.id))
      .slice(0, 3)
      .map((f) => f.equation);
    const options = shuffle([...wrongOptions, formula.equation]);
    return { formulaId: formula.id, question: `What is the equation for: ${formula.name}?`, options, answer: formula.equation, name: formula.name };
  });
}

export default function QuizMode({ formulas, timeLimit = 20, onComplete }) {
  const questions = useMemo(() => buildQuestions(formulas), [formulas]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [history, setHistory] = useState([]);
  const advanceTimeout = useRef(null);

  const current = questions[qIndex];
  const progress = (qIndex / questions.length) * 100;

  useEffect(() => {
    setTimeLeft(timeLimit);
    setSelected(null);
    setLocked(false);
  }, [qIndex, timeLimit]);

  useEffect(() => {
    if (locked) return;
    if (timeLeft <= 0) {
      handleSelect(null);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, locked]);

  useEffect(() => () => clearTimeout(advanceTimeout.current), []);

  const handleSelect = (option) => {
    if (locked) return;
    setLocked(true);
    setSelected(option);
    const isCorrect = option === current.answer;
    const entry = { ...current, chosen: option, correct: isCorrect };
    const newHistory = [...history, entry];
    setHistory(newHistory);

    advanceTimeout.current = setTimeout(() => {
      if (qIndex + 1 < questions.length) {
        setQIndex((i) => i + 1);
      } else {
        const score = newHistory.filter((h) => h.correct).length;
        onComplete?.({ score, total: questions.length, history: newHistory });
      }
    }, 1100);
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="h-1.5 bg-white/5 rounded-full mb-5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
        <span>Question {qIndex + 1} of {questions.length}</span>
        <span className={`flex items-center gap-1 font-medium ${timeLeft <= 5 ? 'text-red-400' : 'text-gray-400'}`}>
          <Clock size={14} /> {timeLeft}s
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="bg-surface border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white text-lg font-medium mb-5">{current.question}</h3>
          <div className="grid gap-3">
            {current.options.map((opt) => {
              const isSelected = selected === opt;
              const isAnswer = opt === current.answer;
              let stateClass = 'border-white/10 hover:border-primary/40';
              if (locked) {
                if (isAnswer) stateClass = 'border-accent bg-accent/10';
                else if (isSelected) stateClass = 'border-red-500 bg-red-500/10';
                else stateClass = 'border-white/5 opacity-50';
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  disabled={locked}
                  className={`flex items-center justify-between text-left bg-darkbg border rounded-xl px-4 py-3 text-white font-mono text-sm transition-all ${stateClass}`}
                >
                  {opt}
                  {locked && isAnswer && <Check size={16} className="text-accent" />}
                  {locked && isSelected && !isAnswer && <X size={16} className="text-red-400" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}   