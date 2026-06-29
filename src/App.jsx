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
import Navbar from './components/Navbar';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#fff', padding: '32px' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function HomeRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: '#fff', padding: '32px', background: '#0F1117', minHeight: '100vh' }}>Loading...</div>;
  return user ? <Dashboard /> : <Landing />;
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// Hides the app's internal Navbar on the public Landing page (it has its own nav bar built in)
function RoutedNavbar() {
  const { user } = useAuth();
  if (!user) return null;
  return <Navbar />;
}