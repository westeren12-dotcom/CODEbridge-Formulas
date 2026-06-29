import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Brain, Layers, Flame, ArrowRight, Check } from 'lucide-react';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0F1117 0%, #14161F 100%)',
    color: '#FFFFFF',
    fontFamily: "'Inter', sans-serif",
    overflowX: 'hidden',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 32px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoBox: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #4F7CFF, #8B5CF6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontWeight: 700, fontSize: '17px', letterSpacing: '-0.3px' },
  navButtons: { display: 'flex', gap: '12px', alignItems: 'center' },
  signInLink: { color: '#9CA3AF', fontSize: '14px', fontWeight: 500, textDecoration: 'none' },
  getStartedBtn: {
    background: 'linear-gradient(135deg, #4F7CFF, #8B5CF6)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(79,124,255,0.35)',
  },
  hero: {
    maxWidth: '880px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '90px 24px 60px',
    position: 'relative',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(79,124,255,0.12)',
    border: '1px solid rgba(79,124,255,0.3)',
    color: '#8FA9FF',
    padding: '8px 16px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 600,
    marginBottom: '28px',
  },
  h1: {
    fontSize: 'clamp(40px, 6vw, 64px)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-1.5px',
    margin: '0 0 24px',
  },
  gradientText: {
    background: 'linear-gradient(135deg, #4F7CFF, #8B5CF6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtext: {
    fontSize: '18px',
    color: '#9CA3AF',
    lineHeight: 1.6,
    maxWidth: '560px',
    margin: '0 auto 36px',
  },
  ctaRow: { display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '28px' },
  primaryBtn: {
    background: 'linear-gradient(135deg, #4F7CFF, #8B5CF6)',
    color: '#fff',
    padding: '15px 30px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 8px 30px rgba(79,124,255,0.4)',
  },
  secondaryBtn: {
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    padding: '15px 30px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 700,
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  microRow: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: '13px',
    color: '#6B7280',
  },
  microItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '56px',
    flexWrap: 'wrap',
    padding: '50px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    maxWidth: '900px',
    margin: '0 auto',
  },
  statNum: {
    fontSize: '34px',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #4F7CFF, #8B5CF6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  statLabel: { fontSize: '13px', color: '#6B7280', marginTop: '4px' },
  featuresWrap: { maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' },
  featuresHead: { textAlign: 'center', marginBottom: '50px' },
  featuresTitle: { fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '10px' },
  featuresSub: { color: '#9CA3AF', fontSize: '15px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' },
  card: {
    background: '#181C24',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '18px',
    padding: '28px',
    transition: 'transform 0.25s, border-color 0.25s',
  },
  cardIconBox: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: 'rgba(79,124,255,0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '18px',
  },
  cardTitle: { fontSize: '17px', fontWeight: 700, marginBottom: '8px' },
  cardText: { fontSize: '14px', color: '#9CA3AF', lineHeight: 1.6 },
  footer: {
    textAlign: 'center',
    padding: '40px 24px',
    color: '#4B5563',
    fontSize: '13px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
};

const FEATURES = [
  { icon: Layers, title: 'Smart Flashcards', text: 'Spaced repetition prioritizes the formulas you actually struggle with — not just random cycling.' },
  { icon: Brain, title: 'Timed Quizzes', text: 'Realistic SAT-style timing with instant feedback so test-day pressure feels familiar.' },
  { icon: Flame, title: 'Streaks & Badges', text: 'Daily streak tracking and unlockable badges keep momentum going every day.' },
  { icon: BookOpen, title: '54 Formulas, Fully Explained', text: 'Every formula includes a worked example, common mistakes, and a memory trick.' },
];

export default function Landing() {
  return (
    <div style={styles.page}>
      <style>{`
        .cb-card:hover { transform: translateY(-4px); border-color: rgba(79,124,255,0.4) !important; }
        .cb-primary-btn:hover { transform: translateY(-2px); }
        .cb-secondary-btn:hover { background: rgba(255,255,255,0.08) !important; }
        @media (max-width: 640px) {
          .cb-nav-signin { display: none; }
        }
      `}</style>

      <nav style={styles.nav}>
        <div style={styles.logoRow}>
          <div style={styles.logoBox}>
            <BookOpen size={18} color="#fff" />
          </div>
          <span style={styles.logoText}>
            CODE<span style={{ color: '#8FA9FF' }}>bridge</span> Formulas
          </span>
        </div>
        <div style={styles.navButtons}>
          <Link to="/login" className="cb-nav-signin" style={styles.signInLink}>Sign In</Link>
          <Link to="/signup" className="cb-primary-btn" style={styles.getStartedBtn}>Get Started</Link>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.badge}>
          <Sparkles size={14} /> Premium SAT Math Prep
        </div>
        <h1 style={styles.h1}>
          Master Every <span style={styles.gradientText}>SAT Formula</span>
        </h1>
        <p style={styles.subtext}>
          Learn, drill, and memorize every SAT Math formula with smart flashcards, timed quizzes,
          and progress tracking built to actually stick.
        </p>
        <div style={styles.ctaRow}>
          <Link to="/signup" className="cb-primary-btn" style={styles.primaryBtn}>
            Start Learning Free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="cb-secondary-btn" style={styles.secondaryBtn}>
            Log In
          </Link>
        </div>
        <div style={styles.microRow}>
          <span style={styles.microItem}><Check size={13} color="#22C55E" /> No credit card required</span>
          <span style={styles.microItem}><Check size={13} color="#22C55E" /> Free practice formulas</span>
          <span style={styles.microItem}><Check size={13} color="#22C55E" /> Cancel anytime</span>
        </div>
      </section>

      <div style={styles.statsRow}>
        <div style={{ textAlign: 'center' }}>
          <div style={styles.statNum}>54+</div>
          <div style={styles.statLabel}>SAT Formulas</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={styles.statNum}>10</div>
          <div style={styles.statLabel}>Math Topics</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={styles.statNum}>100%</div>
          <div style={styles.statLabel}>Free to Start</div>
        </div>
      </div>

      <section style={styles.featuresWrap}>
        <div style={styles.featuresHead}>
          <h2 style={styles.featuresTitle}>Everything you need to memorize formulas</h2>
          <p style={styles.featuresSub}>Built around how memory actually works — not just flashcards on repeat.</p>
        </div>
        <div style={styles.cardGrid}>
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="cb-card" style={styles.card}>
              <div style={styles.cardIconBox}>
                <Icon size={22} color="#8FA9FF" />
              </div>
              <h3 style={styles.cardTitle}>{title}</h3>
              <p style={styles.cardText}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} CODEbridge Formulas. Built for students who want to actually remember this stuff.
      </footer>
    </div>
  );
}