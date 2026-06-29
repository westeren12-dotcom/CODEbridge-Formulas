import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import formulaData from '../data/formulas.json';
import FormulaCard from '../components/FormulaCard';
import SearchBar from '../components/SearchBar';
import FormulaOfTheDay from '../components/FormulaOfTheDay';
import RandomFormulaButton from '../components/RandomFormulaButton';
import StreakBanner from '../components/StreakBanner';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import useBookmarks from '../hooks/useBookmarks';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const { bookmarks, toggleBookmark, loading } = useBookmarks();
  const navigate = useNavigate();

  const filtered = formulaData.formulas.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase()) ||
    f.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-darkbg px-6 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">CODEbridge Formulas</h1>
        <p className="text-gray-400">Master Every SAT Formula</p>
      </header>

      <StreakBanner />

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <FormulaOfTheDay formulas={formulaData.formulas} onSelect={(f) => navigate(`/formula/${f.id}`)} />
        <div className="flex items-center gap-3">
          <SearchBar value={query} onChange={setQuery} />
          <RandomFormulaButton formulas={formulaData.formulas} onSelect={(f) => navigate(`/formula/${f.id}`)} />
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={SearchIcon} title="No formulas found" description={`Nothing matches "${query}". Try a different search term.`} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f) => (
            <FormulaCard
              key={f.id}
              formula={f}
              isBookmarked={bookmarks.includes(f.id)}
              onToggleBookmark={toggleBookmark}
              onClick={() => navigate(`/formula/${f.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}