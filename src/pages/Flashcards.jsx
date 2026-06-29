import formulaData from '../data/formulas.json';
import FlashcardMode from '../components/FlashcardMode';

export default function Flashcards() {
  return (
    <div className="p-8">
      <h1 className="text-white text-2xl font-bold mb-6 text-center">Flashcard Mode</h1>
      <FlashcardMode formulas={formulaData.formulas} />
    </div>
  );
}