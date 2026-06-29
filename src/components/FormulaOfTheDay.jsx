export default function FormulaOfTheDay({ formulas, onSelect }) {
  const dayIndex = new Date().getDate() % formulas.length;
  const formula = formulas[dayIndex];

  return (
    <div
      onClick={() => onSelect(formula)}
      className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 cursor-pointer text-white"
    >
      <p className="text-xs uppercase tracking-wide opacity-80">Formula of the Day</p>
      <h3 className="text-xl font-bold mt-1">{formula.name}</h3>
      <p className="font-mono mt-1">{formula.equation}</p>
    </div>
  );
}