import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sun, Moon, LogOut, Menu, X, Flame, Bookmark,
  LayoutDashboard, Layers, Brain, ChevronDown, Settings, LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';
import Logo from './Logo';
import useOnClickOutside from '../hooks/useOnClickOutside';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/quiz', label: 'Quiz', icon: Brain },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { streak } = useProgress();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const profileRef = useRef(null);
  useOnClickOutside(profileRef, () => { setProfileOpen(false); setConfirmLogout(false); });

  // Sticky header gains a stronger background + shadow once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setConfirmLogout(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    if (!confirmLogout) {
      setConfirmLogout(true);
      return;
    }
    await logout();
    setProfileOpen(false);
    setConfirmLogout(false);
    navigate('/login');
  };

  const initials = (user?.displayName || user?.email || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${scrolled
            ? 'bg-darkbg/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-darkbg/60 backdrop-blur-md border-b border-white/5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo + wordmark */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <Logo size={32} />
            <span className="text-white font-bold text-base sm:text-lg tracking-tight">
              CODE<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">bridge</span>
              <span className="hidden sm:inline"> Formulas</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 relative">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(to) ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Icon size={16} />
                  {label}
                  {isActive(to) && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-white/5 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          )}

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-2.5 py-1.5 rounded-full text-sm font-semibold">
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Flame size={15} fill="currentColor" />
                </motion.span>
                {streak}
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <Sun size={18} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <Moon size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Profile / Auth */}
            {user ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                    {initials}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-surface border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-white font-medium text-sm truncate">
                          {user.displayName || 'Student'}
                        </p>
                        <p className="text-gray-500 text-xs truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Settings size={15} /> Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${confirmLogout
                            ? 'bg-red-500/10 text-red-400 font-medium'
                            : 'text-gray-300 hover:bg-white/5 hover:text-red-400'
                          }`}
                      >
                        <LogOut size={15} />
                        {confirmLogout ? 'Click again to confirm' : 'Log out'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <LogIn size={15} /> Log In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-300 hover:text-white hover:bg-white/5"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 h-full w-[78%] max-w-xs bg-surface border-l border-white/10 z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Logo size={26} />
                  <span className="text-white font-semibold text-sm">CODEbridge</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {user && (
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{user.displayName || 'Student'}</p>
                    <p className="text-gray-500 text-xs truncate">{user.email}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-orange-400 text-sm font-semibold">
                    <Flame size={14} fill="currentColor" /> {streak}
                  </div>
                </div>
              )}

              <nav className="flex-1 px-3 py-4 space-y-1">
                {user ? (
                  NAV_LINKS.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(to) ? 'bg-primary/15 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <Icon size={18} /> {label}
                    </Link>
                  ))
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-primary text-white"
                  >
                    <LogIn size={18} /> Log In
                  </Link>
                )}
              </nav>

              <div className="px-3 py-4 border-t border-white/5 space-y-1">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                {user && (
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${confirmLogout ? 'bg-red-500/10 text-red-400' : 'text-gray-400 hover:bg-white/5 hover:text-red-400'
                      }`}
                  >
                    <LogOut size={18} />
                    {confirmLogout ? 'Tap again to confirm' : 'Log out'}
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

import { Sun, Moon, LogOut, Menu, X, Flame, Bookmark, LayoutDashboard, Layers, Brain, ChevronDown, Settings, LogIn, Award, Zap } from 'lucide-react';
// ...
const NAV_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/quiz', label: 'Quiz', icon: Brain },
  { to: '/revision', label: 'Revision', icon: Zap },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/achievements', label: 'Achievements', icon: Award },
];