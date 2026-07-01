import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildEquationQuestion(formula, pool) {
  const wrongOptions = shuffle(pool.filter((f) => f.id !== formula.id)).slice(0, 3).map((f) => f.equation);
  const options = shuffle([...wrongOptions, formula.equation]);
  return { type: 'equation', question: `What is the equation for: ${formula.name}?`, options, answer: formula.equation, name: formula.name };
}

function buildNextStepQuestion(formula, pool) {
  if (!formula.stepByStepSolution || formula.stepByStepSolution.length < 2) return buildEquationQuestion(formula, pool);
  const stepIndex = Math.floor(Math.random() * (formula.stepByStepSolution.length - 1));
  const correctNext = formula.stepByStepSolution[stepIndex + 1];
  const wrongSteps = shuffle(
    pool.filter((f) => f.id !== formula.id && f.stepByStepSolution?.length)
      .map((f) => f.stepByStepSolution[Math.floor(Math.random() * f.stepByStepSolution.length)])
  ).slice(0, 3);
  const options = shuffle([...wrongSteps, correctNext]);
  return {
    type: 'next-step',
    question: `${formula.name}: after "${formula.stepByStepSolution[stepIndex]}", what's next?`,
    options,
    answer: correctNext,
    name: formula.name,
  };
}

function buildMistakeQuestion(formula, pool) {
  if (!formula.commonMistakes?.length) return buildEquationQuestion(formula, pool);
  const correctMistake = formula.commonMistakes[Math.floor(Math.random() * formula.commonMistakes.length)];
  const wrongMistakes = shuffle(
    pool.filter((f) => f.id !== formula.id && f.commonMistakes?.length)
      .map((f) => f.commonMistakes[Math.floor(Math.random() * f.commonMistakes.length)])
  ).slice(0, 3);
  const options = shuffle([...wrongMistakes, correctMistake]);
  return {
    type: 'mistake',
    question: `Which is a common mistake with ${formula.name}?`,
    options,
    answer: correctMistake,
    name: formula.name,
  };
}

function buildQuestions(formulas) {
  const builders = [buildEquationQuestion, buildNextStepQuestion, buildMistakeQuestion];
  return shuffle(formulas).map((formula) => {
    const builder = builders[Math.floor(Math.random() * builders.length)];
    return builder(formula, formulas);
  });
}

export default function QuizMode({ formulas, timeLimit = 25, onComplete }) {
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
    if (timeLeft <= 0) { handleSelect(null); return; }
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
    }, 1200);
  };

  const TYPE_LABEL = { equation: 'Equation', 'next-step': 'Next Step', mistake: 'Common Mistake' };

  return (
    <div className="max-w-lg mx-auto">
      <div className="h-1.5 bg-white/5 rounded-full mb-5 overflow-hidden">
        <motion.div className="h-full bg-gradient-to-r from-primary to-secondary" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
        <span>Question {qIndex + 1} of {questions.length}</span>
        <span className={`flex items-center gap-1 font-medium ${timeLeft <= 5 ? 'text-red-400' : 'text-gray-400'}`}>
          <Clock size={14} /> {timeLeft}s
        </span>
      </div>
      <span className="text-xs text-gray-500 mb-3 inline-block">{TYPE_LABEL[current.type]}</span>

      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="bg-surface border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-white text-base font-medium mb-5">{current.question}</h3>
          <div className="grid gap-3">
            {current.options.map((opt, i) => {
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
                  key={i}
                  onClick={() => handleSelect(opt)}
                  disabled={locked}
                  className={`flex items-center justify-between text-left bg-darkbg border rounded-xl px-4 py-3 text-white text-sm transition-all ${
                    current.type === 'equation' ? 'font-mono' : ''
                  } ${stateClass}`}
                >
                  <span>{opt}</span>
                  {locked && isAnswer && <Check size={16} className="text-accent shrink-0 ml-2" />}
                  {locked && isSelected && !isAnswer && <X size={16} className="text-red-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}   
const TYPE_DIFFICULTY_WEIGHT = {
  equation: 1,      // mostly recall
  'next-step': 2,   // requires understanding the process
  mistake: 2,       // requires recognizing nuance
};

function pickWeightedBuilder(targetDifficulty) {
  const builders = [
    { fn: buildEquationQuestion, weight: 1 },
    { fn: buildNextStepQuestion, weight: 2 },
    { fn: buildMistakeQuestion, weight: 2 },
  ];

  // Easy quizzes lean toward equation recall; Hard quizzes lean toward next-step/mistake questions
  const adjusted = builders.map((b) => {
    if (targetDifficulty === 'Easy') return { ...b, weight: b.fn === buildEquationQuestion ? 3 : 1 };
    if (targetDifficulty === 'Hard') return { ...b, weight: b.fn === buildEquationQuestion ? 1 : 3 };
    return b; // Medium / All: balanced
  });

  const totalWeight = adjusted.reduce((sum, b) => sum + b.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const b of adjusted) {
    if (roll < b.weight) return b.fn;
    roll -= b.weight;
  }
  return buildEquationQuestion;
}

function buildQuestions(formulas, difficulty = 'All') {
  return shuffle(formulas).map((formula) => {
    const builder = pickWeightedBuilder(difficulty);
    return builder(formula, formulas);
  });
}