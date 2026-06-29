import { useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import formulaData from '../data/formulas.json';
import FormulaCard from '../components/FormulaCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import useBookmarks from '../hooks/useBookmarks';

export default function Bookmarks() {
  const { bookmarks, toggleBookmark, loading } = useBookmarks();
  const navigate = useNavigate();
  const saved = formulaData.formulas.filter((f) => bookmarks.includes(f.id));

  return (
    <div className="min-h-screen bg-darkbg px-6 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Your Bookmarks</h1>
        <p className="text-gray-400">Formulas you've saved for quick access.</p>
      </header>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : saved.length === 0 ? (
        <EmptyState icon={Bookmark} title="No bookmarks yet" description="Tap the bookmark icon on any formula card to save it here." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((f) => (
            <FormulaCard key={f.id} formula={f} isBookmarked={true} onToggleBookmark={toggleBookmark} onClick={() => navigate(`/formula/${f.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}