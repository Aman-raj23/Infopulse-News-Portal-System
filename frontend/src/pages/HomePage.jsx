import React, { useEffect, useState } from 'react';
import { fetchTopHeadlines } from '../api/newsApi.js';
import NewsGrid from '../components/NewsGrid.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [country, setCountry] = useState('us');

  useEffect(() => {
    setPage(1);
  }, [country]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTopHeadlines({ page, pageSize: 12, country });
        if (!isMounted) return;
        setArticles(data.articles || []);
        setHasMore((data.totalResults || 0) > page * 12);
      } catch (e) {
        if (!isMounted) return;
        setError(e.response?.data?.message || 'Failed to load news. Please try again later.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [page, country]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-10 pt-6 md:px-6">
      <section className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Today&apos;s Pulse
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time curated headlines from trusted global sources.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 text-xs text-slate-500 dark:text-slate-400 md:items-end">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            <span>Live feed • auto-cached to minimize API usage</span>
          </div>
          <div className="flex gap-2 rounded-full bg-white/80 p-1 text-[0.7rem] shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-slate-700">
            {[
              { value: 'us', label: 'United States' },
              { value: 'in', label: 'India' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCountry(option.value)}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  country === option.value
                    ? 'bg-gradient-to-tr from-brand to-brand-light text-white shadow-card'
                    : 'text-slate-500 hover:text-brand dark:text-slate-300 dark:hover:text-brand-light'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? <LoadingSkeleton /> : <NewsGrid articles={articles} />}

      {!loading && !error && (
        <div className="mt-8 flex items-center justify-between gap-4 text-sm">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-light dark:hover:text-brand-light"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Page {page} • {country === 'us' ? 'United States' : 'India'}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => (hasMore ? p + 1 : p))}
            disabled={!hasMore}
            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-tr from-brand to-brand-light px-4 py-2 text-xs font-semibold text-white shadow-card transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
};

export default HomePage;
