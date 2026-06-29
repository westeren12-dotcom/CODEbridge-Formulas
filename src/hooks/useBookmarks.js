import { useState, useEffect, useCallback } from 'react';
import { collection, doc, deleteDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export default function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setBookmarks([]); setLoading(false); return; }
    setLoading(true);
    const ref = collection(db, 'users', user.uid, 'bookmarks');
    const unsub = onSnapshot(ref, (snap) => {
      setBookmarks(snap.docs.map((d) => d.id));
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const toggleBookmark = useCallback(async (formulaId) => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid, 'bookmarks', formulaId);
    if (bookmarks.includes(formulaId)) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { savedAt: serverTimestamp() });
    }
  }, [user, bookmarks]);

  return { bookmarks, toggleBookmark, loading };
}