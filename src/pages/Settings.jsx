import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, LogOut, Trash2, Sun, Moon, Flame, Award, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

export default function Settings() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { streak, stats, badges } = useProgress();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = async () => {
    if (!confirmLogout) { setConfirmLogout(true); return; }
    await logout();
    navigate('/login');
  };

  const initials = (user?.displayName || user?.email || '?')
    .split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6">
        <ChevronLeft size={16} /> Back
      </button>

      <h1 className="text-white text-2xl font-bold mb-6">Settings</h1>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-white/10 rounded-2xl p-6 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg font-bold text-white">
          {initials}
        </div>
        <div>
          <p className="text-white font-semibold">{user?.displayName || 'Student'}</p>
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            <Mail size={13} /> {user?.email}
          </p>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface border border-white/10 rounded-2xl p-4 text-center">
          <Flame size={18} className="text-orange-400 mx-auto mb-1.5" />
          <p className="text-white font-bold text-lg">{streak}</p>
          <p className="text-gray-500 text-xs">Day Streak</p>
        </div>
        <div className="bg-surface border border-white/10 rounded-2xl p-4 text-center">
          <Award size={18} className="text-accent mx-auto mb-1.5" />
          <p className="text-white font-bold text-lg">{badges?.length || 0}</p>
          <p className="text-gray-500 text-xs">Badges</p>
        </div>
        <div className="bg-surface border border-white/10 rounded-2xl p-4 text-center">
          <User size={18} className="text-primary mx-auto mb-1.5" />
          <p className="text-white font-bold text-lg">{stats?.quizzesTaken || 0}</p>
          <p className="text-gray-500 text-xs">Quizzes Taken</p>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-surface border border-white/10 rounded-2xl mb-6 overflow-hidden">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-3 text-white text-sm font-medium">
            {isDark ? <Moon size={17} /> : <Sun size={17} />}
            Appearance
          </span>
          <span className="text-gray-400 text-sm">{isDark ? 'Dark' : 'Light'}</span>
        </button>
      </div>

      {/* Account actions */}
      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors ${
            confirmLogout ? 'bg-red-500/10 text-red-400' : 'text-gray-300 hover:bg-white/5 hover:text-red-400'
          }`}
        >
          <LogOut size={17} />
          {confirmLogout ? 'Tap again to confirm logout' : 'Log out'}
        </button>
      </div>

      <p className="text-gray-600 text-xs text-center mt-8">CODEbridge Formulas · v1.0</p>
    </div>
  );
}