import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FormulaDetail from './pages/FormulaDetail';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Bookmarks from './pages/Bookmarks';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#fff', padding: '32px', background: '#0F1117', minHeight: '100vh' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#fff', padding: '32px', background: '#0F1117', minHeight: '100vh' }}>Loading...</div>;
  return user ? <Dashboard /> : <Landing />;
}

function RoutedNavbar() {
  const { user } = useAuth();
  if (!user) return null;
  return <Navbar />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-darkbg">
      <RoutedNavbar />
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/formula/:id" element={<PrivateRoute><FormulaDetail /></PrivateRoute>} />
        <Route path="/flashcards" element={<PrivateRoute><Flashcards /></PrivateRoute>} />
        <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/bookmarks" element={<PrivateRoute><Bookmarks /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
import AnimatedBackground from './components/AnimatedBackground';

export default function App() {
  return (
    <div className="min-h-screen bg-darkbg relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <RoutedNavbar />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/formula/:id" element={<PrivateRoute><FormulaDetail /></PrivateRoute>} />
          <Route path="/flashcards" element={<PrivateRoute><Flashcards /></PrivateRoute>} />
          <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/bookmarks" element={<PrivateRoute><Bookmarks /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
          <Route path="/revision" element={<PrivateRoute><QuickRevision /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import AnimatedBackground from './components/AnimatedBackground';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FormulaDetail from './pages/FormulaDetail';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Bookmarks from './pages/Bookmarks';
import Settings from './pages/Settings';
import Achievements from './pages/Achievements';
import QuickRevision from './pages/QuickRevision';
import Progress from './pages/Progress';
import Onboarding from './pages/Onboarding';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#fff', padding: '32px', background: '#0F1117', minHeight: '100vh' }}>Loading...</div>;
  return user ? <ErrorBoundary>{children}</ErrorBoundary> : <Navigate to="/login" replace />;
}

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#fff', padding: '32px', background: '#0F1117', minHeight: '100vh' }}>Loading...</div>;
  return user ? <Dashboard /> : <Landing />;
}

function RoutedNavbar() {
  const { user } = useAuth();
  if (!user) return null;
  return <Navbar />;
}

function RoutedBottomNav() {
  const { user } = useAuth();
  if (!user) return null;
  return <BottomNav />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-darkbg relative">
      <AnimatedBackground />
      <div className="relative z-10 pb-20 md:pb-0">
        <RoutedNavbar />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
          <Route path="/formula/:id" element={<PrivateRoute><FormulaDetail /></PrivateRoute>} />
          <Route path="/formula/:id/preview" element={<ErrorBoundary><FormulaDetail preview /></ErrorBoundary>} />
          <Route path="/flashcards" element={<PrivateRoute><Flashcards /></PrivateRoute>} />
          <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/bookmarks" element={<PrivateRoute><Bookmarks /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
          <Route path="/revision" element={<PrivateRoute><QuickRevision /></PrivateRoute>} />
          <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <RoutedBottomNav />
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/config';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import AnimatedBackground from './components/AnimatedBackground';
import BottomNav from './components/BottomNav';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FormulaDetail from './pages/FormulaDetail';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Bookmarks from './pages/Bookmarks';
import Settings from './pages/Settings';
import Achievements from './pages/Achievements';
import QuickRevision from './pages/QuickRevision';
import Progress from './pages/Progress';
import Onboarding from './pages/Onboarding';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ color: '#fff', padding: '32px', background: '#0F1117', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading...
    </div>
  );
  return user ? <ErrorBoundary>{children}</ErrorBoundary> : <Navigate to="/login" replace />;
}

function HomeRoute() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { setChecking(false); return; }
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (snap.exists() && snap.data().onboardingComplete === false) {
        navigate('/onboarding', { replace: true });
      }
      setChecking(false);
    }).catch(() => setChecking(false));
  }, [user, loading]);

  if (loading || checking) return (
    <div style={{ color: '#fff', padding: '32px', background: '#0F1117', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading...
    </div>
  );
  return user ? <ErrorBoundary><Dashboard /></ErrorBoundary> : <Landing />;
}

function RoutedNavbar() {
  const { user } = useAuth();
  if (!user) return null;
  return <Navbar />;
}

function RoutedBottomNav() {
  const { user } = useAuth();
  if (!user) return null;
  return <BottomNav />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-darkbg relative">
      <AnimatedBackground />
      <div className="relative z-10 pb-20 md:pb-0">
        <RoutedNavbar />
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
          <Route path="/formula/:id" element={<PrivateRoute><FormulaDetail /></PrivateRoute>} />
          <Route path="/formula/:id/preview" element={<ErrorBoundary><FormulaDetail preview /></ErrorBoundary>} />
          <Route path="/flashcards" element={<PrivateRoute><Flashcards /></PrivateRoute>} />
          <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
          <Route path="/bookmarks" element={<PrivateRoute><Bookmarks /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
          <Route path="/revision" element={<PrivateRoute><QuickRevision /></PrivateRoute>} />
          <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <RoutedBottomNav />
      </div>
    </div>
  );
}