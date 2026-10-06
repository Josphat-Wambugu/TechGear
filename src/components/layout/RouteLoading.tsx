/** Minimal full-height spinner shown while a lazy-loaded route chunk is fetched. */
export default function RouteLoading() {
  return (
    <div className="flex-1 min-h-[50vh] flex items-center justify-center">
      <div
        className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-brand-600 animate-spin"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
}
