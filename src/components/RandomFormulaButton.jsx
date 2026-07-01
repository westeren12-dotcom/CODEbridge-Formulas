import { useRef } from 'react';
import { Shuffle } from 'lucide-react';

const HISTORY_SIZE = 5; // won't repeat the last 5 picks until pool is exhausted

export default function RandomFormulaButton({ formulas, onSelect }) {
  const historyRef = useRef([]);

  const pickRandom = () => {
    const recentIds = historyRef.current;
    let pool = formulas.filter((f) => !recentIds.includes(f.id));

    // If filtering leaves nothing (small formula set or history full), reset
    if (pool.length === 0) pool = formulas;

    const pick = pool[Math.floor(Math.random() * pool.length)];

    historyRef.current = [pick.id, ...recentIds].slice(0, HISTORY_SIZE);
    onSelect(pick);
  };

  return (
    <button
      onClick={pickRandom}
      className="flex items-center gap-1.5 bg-surface border border-white/10 text-white px-4 py-2 rounded-xl hover:border-primary/50 transition-colors text-sm font-medium shrink-0"
    >
      <Shuffle size={15} /> Random
    </button>
  );
}
