import { useParams, useNavigate } from 'react-router-dom';
import formulaData from '../data/formulas.json';

export default function FormulaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formula = formulaData.formulas.find((f) => f.id === id);

  if (!formula) return <div className="text-white p-8">Formula not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <button onClick={() => navigate(-1)} className="text-gray-400 mb-4">← Back</button>
      <h1 className="text-2xl font-bold">{formula.name}</h1>
      <p className="text-primary font-mono text-lg mt-2">{formula.equation}</p>
      <p className="mt-4 text-gray-300">{formula.explanation}</p>
      <h3 className="mt-6 font-semibold">Easy Explanation</h3>
      <p className="text-gray-400">{formula.easyExplanation}</p>
      <h3 className="mt-6 font-semibold">Example</h3>
      <p className="text-gray-400">{formula.exampleProblem}</p>
      <ol className="list-decimal ml-5 mt-2 text-gray-400 space-y-1">
        {formula.stepByStepSolution.map((step, i) => <li key={i}>{step}</li>)}
      </ol>
      <h3 className="mt-6 font-semibold">Common Mistakes</h3>
      <ul className="list-disc ml-5 text-gray-400">
        {formula.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
      </ul>
      <h3 className="mt-6 font-semibold">Memory Trick</h3>
      <p className="text-accent">{formula.memoryTrick}</p>
    </div>
  );
}