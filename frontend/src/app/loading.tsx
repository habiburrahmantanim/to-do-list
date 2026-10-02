export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-slate-100" />
        <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">
          Loading TaskFlow...
        </p>
      </div>
    </div>
  );
}
