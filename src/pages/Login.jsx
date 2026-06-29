import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

const ERROR_MESSAGES = {
  'auth/invalid-email': 'That email address looks invalid.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/wrong-password': 'Incorrect password. Try again.',
  'auth/invalid-credential': 'Email or password is incorrect.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
};

function friendlyError(err) {
  return ERROR_MESSAGES[err?.code] || 'Something went wrong. Please try again.';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { login, googleLogin, resetPassword } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address.';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await googleLogin();
      navigate('/');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setResetMessage('');
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter your email above first, then click "Forgot password".');
      return;
    }
    try {
      await resetPassword(email);
      setResetMessage(`Password reset email sent to ${email}.`);
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
      <p className="text-gray-400 text-sm mb-6">Log in to keep your streak alive.</p>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-3 py-2"
          >
            {error}
          </motion.div>
        )}
        {resetMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 bg-accent/10 border border-accent/30 text-accent text-sm rounded-xl px-3 py-2"
          >
            {resetMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={`w-full bg-surface border rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder:text-gray-500 outline-none transition-colors ${
                fieldErrors.email ? 'border-red-500/50' : 'border-white/10 focus:border-primary/60'
              }`}
            />
          </div>
          {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
        </div>

        <div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={`w-full bg-surface border rounded-xl pl-9 pr-10 py-2.5 text-white text-sm placeholder:text-gray-500 outline-none transition-colors ${
                fieldErrors.password ? 'border-red-500/50' : 'border-white/10 focus:border-primary/60'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
        </div>

        <div className="flex justify-end -mt-1">
          <button type="button" onClick={handleForgotPassword} className="text-xs text-primary hover:underline">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="h-px bg-white/10 flex-1" />
        <span className="text-gray-500 text-xs">OR</span>
        <div className="h-px bg-white/10 flex-1" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-60"
      >
        {googleLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.4c-.3 1.5-1.2 2.8-2.5 3.6v3h4.3c2.5-2.3 3.3-5.6 3.3-8.7z" />
            <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-4.3-3c-1.1.8-2.5 1.3-3.6 1.3-3.4 0-6.3-2.3-7.3-5.4H.3v3.1C2.3 21.3 6.8 24 12 24z" />
            <path fill="#FBBC05" d="M4.7 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V6.9H.3a12 12 0 0 0 0 10.2L4.7 14z" />
            <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.2 15.2 0 12 0 6.8 0 2.3 2.7.3 6.9l4.4 3.1c1-3.1 3.9-5.2 7.3-5.2z" />
          </svg>
        )}
        Continue with Google
      </button>

      <p className="text-gray-400 text-sm text-center mt-6">
        Don't have an account? <Link to="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
      </p>
    </AuthLayout>
  );
}