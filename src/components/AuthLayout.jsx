import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Logo from './Logo';

const FEATURES = [
  'All 5 SAT Math formula domains, fully explained',
  'Flashcards, timed quizzes, and smart revision',
  'Streaks, badges, and progress tracking',
];

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-darkbg">
      <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-primary via-secondary to-[#3b2f8f]">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-2.5">
          <Logo size={36} />
          <span className="text-white font-bold text-xl">CODEbridge Formulas</span>
        </div>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white leading-tight mb-6"
          >
            Master Every SAT Formula
          </motion.h2>
          <ul className="space-y-3">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className="flex items-start gap-2.5 text-white/90 text-sm"
              >
                <span className="mt-0.5 w-5 h-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Check size={12} />
                </span>
                {f}
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-white/50 text-xs">
          © {new Date().getFullYear()} CODEbridge Formulas
        </p>
      </div>

      <div className="flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <Logo size={32} />
          <span className="text-white font-bold text-lg">CODEbridge Formulas</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}