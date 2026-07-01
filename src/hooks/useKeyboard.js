import { useEffect } from 'react';

export default function useKeyboard(keyMap) {
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const action = keyMap[e.key] || keyMap[e.code];
      if (action) { e.preventDefault(); action(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [keyMap]);
}