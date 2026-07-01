import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Pause, Play, ChevronRight, ChevronLeft as Prev, Zap } from 'lucide-react';
import formulaData from '../data/formulas.json';

const SPEEDS = [
  { key: 'slow', label: 'Slow', seconds: 6 },
  { key: 'normal', label: 'Normal', seconds: 4 },
  { key: 'fast', label: 'Fast', seconds: 2.5 },
];

export default function QuickRevision() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [speedKey, setSpeedKey] = useState('normal');
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef(null);

  const formulas = useMemo(() => [...formulaData.formulas].sort(() => Math.random() - 0.5), []);
  const speed = SPEEDS.find((s) => s.key === speedKey).seconds;
  const current = formulas[index];

  useEffect(() => {
    if (!started || !playing) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1 < formulas.length ? i + 1 : 0));
    }, speed * 1000);
    return () => clearInterval(intervalRef.current);
  }, [started, playing, speed, formulas.length]);

  if (!started) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-8 mx-auto">
          <ChevronLeft size={16} /> Back
        </button>
        <Zap size={36} className="text-primary mx-auto mb-4" />
        <h1 className="text-white text-2xl font-bold mb-2">Quick Revision</h1>
        <p className="text-gray-400 text-sm mb-8">
          Rapid-fire pass through every formula — equation and explanation, no quizzing. Good for the night before a test.
        </p>

        <p className="text-gray-500 text-xs mb-3">Pace</p>
        <div className="flex justify-center gap-2 mb-10">
          {SPEEDS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSpeedKey(s.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                speedKey === s.key ? 'bg-primary border-primary text-white' : 'border-white/10 text-gray-400 hover:border-primary/40'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setStarted(true)}
          className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Start ({formulas.length} formulas)
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
          <ChevronLeft size={16} /> Exit
        </button>
        <span className="text-gray-500 text-xs">{index + 1} / {formulas.length}</span>
      </div>

      <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
        <motion.div
          key={index}
          className="h-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: '0%' }}
          animate={{ width: playing ? '100%' : '0%' }}
          transition={{ duration: playing ? speed : 0, ease: 'linear' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="w-full bg-surface border border-white/10 rounded-3xl p-8 text-center mb-6 min-h-[220px] flex flex-col justify-center"
        >
          <p className="text-gray-500 text-xs mb-2">{current.name}</p>
          <p className="text-primary font-mono text-xl mb-4">{current.equation}</p>
          <p className="text-white text-sm leading-relaxed">{current.easyExplanation}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setIndex((i) => (i - 1 + formulas.length) % formulas.length)}
          className="p-3 bg-surface rounded-full hover:bg-primary/20 text-white"
        >
          <Prev size={18} />
        </button>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="p-4 bg-primary rounded-full hover:bg-primary/90 text-white"
        >
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          onClick={() => setIndex((i) => (i + 1) % formulas.length)}
          className="p-3 bg-surface rounded-full hover:bg-primary/20 text-white"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}