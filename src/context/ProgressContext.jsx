import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

export const BADGE_DEFINITIONS = [
  { id: 'first-step', label: 'First Step', description: 'Complete your first quiz', condition: (s) => s.quizzesTaken >= 1 },
  { id: 'streak-3', label: '3-Day Streak', description: 'Study 3 days in a row', condition: (s) => s.streak >= 3 },
  { id: 'streak-7', label: 'Week Warrior', description: 'Study 7 days in a row', condition: (s) => s.streak >= 7 },
  { id: 'quiz-master', label: 'Quiz Master', description: 'Pass 10 quizzes', condition: (s) => s.quizzesPassed >= 10 },
  { id: 'perfect-score', label: 'Perfectionist', description: 'Get a perfect quiz score', condition: (s) => s.lastPerfect },
];

export function ProgressProvider({ children }) {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [lastStudyDate, setLastStudyDate] = useState(null);
  const [badges, setBadges] = useState([]);
  const [stats, setStats] = useState({ quizzesTaken: 0, quizzesPassed: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setStreak(data.streak?.current || 0);
        setLastStudyDate(data.streak?.lastStudyDate || null);
        setBadges(data.badges || []);
        setStats({
          quizzesTaken: data.quizzesTaken || 0,
          quizzesPassed: data.quizzesPassed || 0,
        });
      }
    })();
  }, [user]);

  const recordStudySession = async () => {
    if (!user) return streak;
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    const data = snap.data();
    const today = new Date().toDateString();
    const last = data.streak?.lastStudyDate;
    let newStreak = data.streak?.current || 0;

    if (last !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      newStreak = last === yesterday ? newStreak + 1 : 1;
      await updateDoc(ref, {
        streak: {
          current: newStreak,
          longest: Math.max(newStreak, data.streak?.longest || 0),
          lastStudyDate: today,
        },
      });
      setStreak(newStreak);
      setLastStudyDate(today);
    }
    return newStreak;
  };

  const checkBadges = async (liveStats) => {
    const earned = BADGE_DEFINITIONS.filter((b) => b.condition(liveStats)).map((b) => b.id);
    const newOnes = earned.filter((id) => !badges.includes(id));
    if (newOnes.length && user) {
      const merged = [...badges, ...newOnes];
      await updateDoc(doc(db, 'users', user.uid), { badges: merged });
      setBadges(merged);
     return BADGE_DEFINITIONS.filter((b) => newOnes.includes(b.id));
    }
    return [];
  };

  const recordQuizResult = async (score, total) => {
    if (!user) return { earnedBadges: [], newStreak: streak, passed: false };
    const passed = score / total >= 0.7;
    const isPerfect = score === total;
    const ref = doc(db, 'users', user.uid);

    await updateDoc(ref, {
      quizzesTaken: increment(1),
      ...(passed && { quizzesPassed: increment(1) }),
    });

    const newQuizzesTaken = stats.quizzesTaken + 1;
    const newQuizzesPassed = stats.quizzesPassed + (passed ? 1 : 0);
    setStats({ quizzesTaken: newQuizzesTaken, quizzesPassed: newQuizzesPassed });

    const newStreak = await recordStudySession();
    const earnedBadges = await checkBadges({
      quizzesTaken: newQuizzesTaken,
      quizzesPassed: newQuizzesPassed,
      streak: newStreak,
      lastPerfect: isPerfect,
    });

    return { earnedBadges, newStreak, passed };
  };

  return (
    <ProgressContext.Provider value={{ streak, lastStudyDate, badges, stats, recordStudySession, checkBadges, recordQuizResult }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);