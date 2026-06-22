import React from 'react';

const CardSkeleton = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
    <div className="h-40 w-full animate-pulse bg-slate-200 dark:bg-slate-800" />
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-7 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  </div>
);

const LoadingSkeleton = ({ count = 6 }) => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export default LoadingSkeleton;
