import { useState, useMemo } from 'react';
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
import CategoryFilter from '../components/CategoryFilter';
import useBookmarks from '../hooks/useBookmarks';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const { bookmarks, toggleBookmark, loading } = useBookmarks();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return formulaData.formulas.filter((f) => {
      const matchesQuery =
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory =
        category === 'all' || f.tags.some((t) => t.toLowerCase() === category.toLowerCase());
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-darkbg px-6 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">CODEbridge Formulas</h1>
        <p className="text-gray-400">Master Every SAT Formula</p>
      </header>

      <StreakBanner />

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <FormulaOfTheDay formulas={formulaData.formulas} onSelect={(f) => navigate(`/formula/${f.id}`)} />
        <div className="flex items-center gap-3">
          <SearchBar value={query} onChange={setQuery} />
          <RandomFormulaButton formulas={formulaData.formulas} onSelect={(f) => navigate(`/formula/${f.id}`)} />
        </div>
      </div>

      <div className="mb-6">
        <CategoryFilter active={category} onChange={setCategory} />
      </div>

      <p className="text-gray-500 text-xs mb-4">{filtered.length} formula{filtered.length !== 1 ? 's' : ''}</p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={SearchIcon} title="No formulas found" description="Try a different search term or category." />
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
import useFormulaProgress from '../hooks/useFormulaProgress';
// ...other imports stay the same

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const { bookmarks, toggleBookmark, loading } = useBookmarks();
  const { getMastery } = useFormulaProgress();
  const navigate = useNavigate();

  // ...filtered logic unchanged...

  return (
    // ...unchanged JSX until the card map...
    <FormulaCard
      key={f.id}
      formula={f}
      isBookmarked={bookmarks.includes(f.id)}
      onToggleBookmark={toggleBookmark}
      onClick={() => navigate(`/formula/${f.id}`)}
      mastery={getMastery(f.id)}
    />
    // ...rest unchanged...
  );
}
import { useState, useMemo } from 'react';
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
import CategoryFilter from '../components/CategoryFilter';
import DueTodayBanner from '../components/DueTodayBanner';
import useBookmarks from '../hooks/useBookmarks';
import useFormulaProgress from '../hooks/useFormulaProgress';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const { bookmarks, toggleBookmark, loading } = useBookmarks();
  const { getMastery, buildQueue } = useFormulaProgress();
  const navigate = useNavigate();

  const { queue: dueQueue } = useMemo(
    () => buildQueue(formulaData.formulas),
    [buildQueue]
  );

  const filtered = useMemo(() => {
    return formulaData.formulas.filter((f) => {
      const matchesQuery =
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory =
        category === 'all' || f.tags.some((t) => t.toLowerCase() === category.toLowerCase());
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-darkbg px-6 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">CODEbridge Formulas</h1>
        <p className="text-gray-400">Master Every SAT Formula</p>
      </header>

      <StreakBanner />
      <DueTodayBanner dueCount={dueQueue.length} />

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <FormulaOfTheDay formulas={formulaData.formulas} onSelect={(f) => navigate(`/formula/${f.id}`)} />
        <div className="flex items-center gap-3">
          <SearchBar value={query} onChange={setQuery} />
          <RandomFormulaButton formulas={formulaData.formulas} onSelect={(f) => navigate(`/formula/${f.id}`)} />
        </div>
      </div>

      <div className="mb-6">
        <CategoryFilter active={category} onChange={setCategory} />
      </div>

      <p className="text-gray-500 text-xs mb-4">
        {filtered.length} formula{filtered.length !== 1 ? 's' : ''}
      </p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={SearchIcon} title="No formulas found" description="Try a different search term or category." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f) => (
            <FormulaCard
              key={f.id}
              formula={f}
              isBookmarked={bookmarks.includes(f.id)}
              onToggleBookmark={toggleBookmark}
              onClick={() => navigate(`/formula/${f.id}`)}
              mastery={getMastery(f.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}