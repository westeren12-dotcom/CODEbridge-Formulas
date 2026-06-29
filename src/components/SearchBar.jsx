import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-surface border border-white/10 rounded-xl px-3 py-2 flex-1">
      <Search size={18} className="text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search formulas, tags..."
        className="bg-transparent outline-none text-white w-full placeholder:text-gray-500"
      />
    </div>
  );
}