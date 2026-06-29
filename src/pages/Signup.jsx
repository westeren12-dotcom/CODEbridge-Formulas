import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

const ERROR_MESSAGES = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'That email address looks invalid.',
  'auth/weak-password': 'Password should be at least 6 characters.',
};

function friendlyError(err) {
  return ERROR_MESSAGES[err?.code] || 'Something went wrong. Please try again.';
}

function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-accent'];

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const strength = useMemo(() => getStrength(password), [password]);

  const validate = () => {
    const errs = {};
    if (name.trim().length < 2) errs.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address.';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (confirmPassword !== password) errs.confirmPassword = 'Passwords do not match.';
    if (!agreed) errs.agreed = 'You must agree to the terms to continue.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(email, password, name.trim());
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

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
      <p className="text-gray-400 text-sm mb-6">Start mastering SAT formulas today.</p>

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
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className={`w-full bg-surface border rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder:text-gray-500 outline-none transition-colors ${
                fieldErrors.name ? 'border-red-500/50' : 'border-white/10 focus:border-primary/60'
              }`}
            />
          </div>
          {fieldErrors.name && <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>}
        </div>

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
              autoComplete="new-password"
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

          {password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${i < strength ? STRENGTH_COLORS[strength] : 'bg-white/10'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{STRENGTH_LABELS[strength]}</p>
            </div>
          )}
        </div>

        <div>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className={`w-full bg-surface border rounded-xl pl-9 pr-3 py-2.5 text-white text-sm placeholder:text-gray-500 outline-none transition-colors ${
                fieldErrors.confirmPassword ? 'border-red-500/50' : 'border-white/10 focus:border-primary/60'
              }`}
            />
          </div>
          {fieldErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
        </div>

        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <button
              type="button"
              onClick={() => setAgreed((a) => !a)}
              className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                agreed ? 'bg-primary border-primary' : 'border-white/20'
              }`}
            >
              {agreed && <Check size={11} className="text-white" />}
            </button>
            <span className="text-xs text-gray-400">I agree to the Terms of Service and Privacy Policy.</span>
          </label>
          {fieldErrors.agreed && <p className="text-red-400 text-xs mt-1">{fieldErrors.agreed}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Creating account...' : 'Create Account'}
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
        Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  );
}