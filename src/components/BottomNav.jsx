import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Layers, Brain, Zap, TrendingUp } from 'lucide-react';

const ITEMS = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/flashcards', label: 'Cards', icon: Layers },
  { to: '/quiz', label: 'Quiz', icon: Brain },
  { to: '/revision', label: 'Revision', icon: Zap },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-darkbg/90 backdrop-blur-xl border-t border-white/5">
      <div className="flex items-center justify-around px-2 py-2">
        {ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors"
            >
              <Icon size={20} className={isActive ? 'text-primary' : 'text-gray-500'} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-gray-600'}`}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}