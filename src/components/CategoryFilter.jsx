const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'algebra', label: 'Algebra' },
  { key: 'functions', label: 'Functions' },
  { key: 'quadratics', label: 'Quadratics' },
  { key: 'polynomials', label: 'Polynomials' },
  { key: 'coordinate geometry', label: 'Coordinate Geo' },
  { key: 'geometry', label: 'Geometry' },
  { key: 'trigonometry', label: 'Trigonometry' },
  { key: 'statistics', label: 'Statistics' },
  { key: 'sequences', label: 'Sequences' },
];

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onChange(cat.key)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            active === cat.key
              ? 'bg-primary text-white'
              : 'bg-surface text-gray-400 border border-white/10 hover:border-primary/40 hover:text-white'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}