export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cb-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F7CFF" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#cb-grad)" />
      {/* bridge towers */}
      <path d="M14 32V20a2 2 0 0 1 2-2 2 2 0 0 1 2 2v12" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M30 32V20a2 2 0 0 1 2-2 2 2 0 0 1 2 2v12" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      {/* deck */}
      <path d="M9 32h30" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
      {/* suspension arc */}
      <path d="M9 26c5-9 25-9 30 0" stroke="white" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" />
      {/* cable ties */}
      <path d="M16 32v-4M24 32v-7M32 32v-4" stroke="white" strokeOpacity="0.85" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}