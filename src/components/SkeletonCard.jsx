export default function SkeletonCard() {
  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-5 w-20 bg-white/5 rounded-full" />
        <div className="h-5 w-5 bg-white/5 rounded-full" />
      </div>
      <div className="h-5 w-3/4 bg-white/5 rounded mb-2" />
      <div className="h-4 w-1/2 bg-white/5 rounded mb-3" />
      <div className="h-3 w-full bg-white/5 rounded mb-1" />
      <div className="h-3 w-5/6 bg-white/5 rounded" />
    </div>
  );
}