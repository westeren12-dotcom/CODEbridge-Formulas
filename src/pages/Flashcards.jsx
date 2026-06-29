import { useMemo, useState } from 'react';
import { PartyPopper, Layers } from 'lucide-react';
import formulaData from '../data/formulas.json';
import FlashcardMode from '../components/FlashcardMode';
import EmptyState from '../components/EmptyState';
import useFormulaProgress from '../hooks/useFormulaProgress';
import { useProgress } from '../context/ProgressContext';

export default function Flashcards() {
  const { loading, recordReview, buildQueue, getMastery } = useFormulaProgress();
  const { recordStudySession } = useProgress();
  const [done, setDone] = useState(false);

  const { queue, laterCount } = useMemo(
    () => buildQueue(formulaData.formulas),
    [buildQueue]
  );

  if (loading) {
    return <div className="text-gray-500 text-center py-20">Loading your deck...</div>;
  }

  if (done || queue.length === 0) {
    return (
      <div className="px-6 py-10">
        <EmptyState
          icon={PartyPopper}
          title={done ? "You're all caught up! 🎉" : 'Nothing due right now'}
          description={
            laterCount > 0
              ? `${laterCount} formula${laterCount !== 1 ? 's' : ''} will come back for review soon.`
              : 'Come back tomorrow for your next review session.'
          }
        />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 justify-center mb-2">
        <Layers size={18} className="text-primary" />
        <h1 className="text-white text-2xl font-bold">Flashcard Mode</h1>
      </div>
      <p className="text-gray-500 text-sm text-center mb-8">Cards are prioritized by what you're weakest on.</p>
      <FlashcardMode
        queue={queue}
        getMastery={getMastery}
        onReview={recordReview}
        onFinished={() => { setDone(true); recordStudySession(); }}
      />
    </div>
  );
}