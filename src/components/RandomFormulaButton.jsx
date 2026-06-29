export default function RandomFormulaButton({ formulas, onSelect }) {
  const pickRandom = () => {
    const f = formulas[Math.floor(Math.random() * formulas.length)];
    onSelect(f);
  };
  return (
    <button
      onClick={pickRandom}
      className="bg-surface border border-white/10 text-white px-4 py-2 rounded-xl hover:border-primary/50"
    >
      🎲 Random Formula
    </button>
  );
}
