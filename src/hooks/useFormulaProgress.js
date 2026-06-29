import { useState, useEffect, useCallback } from 'react';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const INTERVAL_DAYS = { 1: 1, 2: 3, 3: 7 };
const MASTERY_LABEL = { 1: 'learning', 2: 'reviewing', 3: 'mastered' };

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function useFormulaProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setProgress({}); setLoading(false); return; }
    (async () => {
      setLoading(true);
      const snap = await getDocs(collection(db, 'users', user.uid, 'progress'));
      const map = {};
      snap.forEach((d) => { map[d.id] = d.data(); });
      setProgress(map);
      setLoading(false);
    })();
  }, [user]);

  const recordReview = useCallback(async (formulaId, knewIt) => {
    if (!user) return;
    const current = progress[formulaId];
    const currentBox = current?.box || 0;
    const newBox = knewIt ? Math.min(currentBox + 1, 3) : 1;
    const nextReview = addDays(new Date(), INTERVAL_DAYS[newBox] || 1).toISOString();
    const updated = {
      box: newBox,
      nextReview,
      timesReviewed: (current?.timesReviewed || 0) + 1,
      lastResult: knewIt ? 'know' : 'forgot',
      mastery: MASTERY_LABEL[newBox],
    };
    await setDoc(doc(db, 'users', user.uid, 'progress', formulaId), updated, { merge: true });
    setProgress((p) => ({ ...p, [formulaId]: updated }));
  }, [user, progress]);

  const buildQueue = useCallback((formulas) => {
    const today = new Date();
    const due = [];
    const unseen = [];
    let laterCount = 0;

    formulas.forEach((f) => {
      const p = progress[f.id];
      if (!p) { unseen.push(f); return; }
      if (new Date(p.nextReview) <= today) due.push({ formula: f, box: p.box });
      else laterCount++;
    });

    due.sort((a, b) => a.box - b.box);
    return { queue: [...due.map((d) => d.formula), ...unseen], laterCount };
  }, [progress]);

  const getMastery = useCallback((formulaId) => progress[formulaId]?.mastery || 'new', [progress]);

  return { progress, loading, recordReview, buildQueue, getMastery };
}