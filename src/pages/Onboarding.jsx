import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BookOpen, Brain, Check, ArrowRight } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const TOPICS = [
  { key: 'algebra', label: 'Algebra', emoji: '📐' },
  { key: 'functions', label: 'Functions', emoji: '📈' },
  { key: 'quadratics', label: 'Quadratics', emoji: '🔢' },
  { key: 'geometry', label: 'Geometry', emoji: '📏' },
  { key: 'trigonometry', label: 'Trigonometry', emoji: '🔺' },
  { key: 'statistics', label: 'Statistics', emoji: '📊' },
  { key: 'sequences', label: 'Sequences', emoji: '🔗' },
];

const GOALS = [
  { key: 'test-soon', label: 'SAT in under 4 weeks', emoji: '⚡' },
  { key: 'test-later', label: 'SAT in 1-3 months', emoji: '📅' },
  { key: 'just-learning', label: 'Just brushing up', emoji: '📚' },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [weakTopics, setWeakTopics] = useState([]);
  const [goal, setGoal] = useState('');
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toggleTopic = (key) =>
    setWeakTopics((t) => t.includes(key) ? t.filter((k) => k !== key) : [...t, key]);

  const finish = async () => {
    setSaving(true);
    try {
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          onboardingComplete: true,
          weakTopics,
          goal,
        });
      }
    } catch (e) {
      console.error(e);
    }
    navigate('/');
  };

  const steps = [
    // Step 0 — Welcome
    <motion.div key="welcome" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6">
        <Sparkles size={28} className="text-white" />
      </div>
      <h1 className="text-white text-3xl font-bold mb-3">Welcome to CODEbridge</h1>
      <p className="text-gray-400 mb-2">The fastest way to master every SAT Math formula.</p>
      <p className="text-gray-500 text-sm mb-10">Answer two quick questions so we can personalize your experience.</p>
      <button onClick={() => setStep(1)} className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-2 mx-auto transition-colors">
        Get Started <ArrowRight size={16} />
      </button>
    </motion.div>,

    // Step 1 — Weak topics
    <motion.div key="topics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-1">
        <BookOpen size={18} className="text-primary" />
        <span className="text-gray-500 text-sm">Step 1 of 2</span>
      </div>
      <h2 className="text-white text-2xl font-bold mb-2">Which topics feel weakest?</h2>
      <p className="text-gray-500 text-sm mb-6">We'll prioritize these in your flashcard queue.</p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {TOPICS.map((t) => {
          const selected = weakTopics.includes(t.key);
          return (
            <button
              key={t.key}
              onClick={() => toggleTopic(t.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                selected ? 'bg-primary/15 border-primary text-white' : 'bg-surface border-white/10 text-gray-400 hover:border-primary/40'
              }`}
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="text-sm font-medium">{t.label}</span>
              {selected && <Check size={14} className="ml-auto text-primary" />}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => setStep(2)}
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        Continue <ArrowRight size={16} />
      </button>
      <button onClick={() => setStep(2)} className="w-full text-gray-600 text-sm mt-3 hover:text-gray-400">
        Skip
      </button>
    </motion.div>,

    // Step 2 — Goal
    <motion.div key="goal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-1">
        <Brain size={18} className="text-primary" />
        <span className="text-gray-500 text-sm">Step 2 of 2</span>
      </div>
      <h2 className="text-white text-2xl font-bold mb-2">When's your SAT?</h2>
      <p className="text-gray-500 text-sm mb-6">We'll suggest how many formulas to review each day.</p>
      <div className="space-y-3 mb-8">
        {GOALS.map((g) => (
          <button
            key={g.key}
            onClick={() => setGoal(g.key)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-colors ${
              goal === g.key ? 'bg-primary/15 border-primary text-white' : 'bg-surface border-white/10 text-gray-400 hover:border-primary/40'
            }`}
          >
            <span className="text-2xl">{g.emoji}</span>
            <span className="text-sm font-medium">{g.label}</span>
            {goal === g.key && <Check size={15} className="ml-auto text-primary" />}
          </button>
        ))}
      </div>
      <button
        onClick={finish}
        disabled={saving}
        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 rounded-xl transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {saving ? 'Setting up...' : <><Sparkles size={16} /> Start Learning</>}
      </button>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>
      </div>
    </div>
  );
}