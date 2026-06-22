import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchNews } from '../api/newsApi.js';
import NewsGrid from '../components/NewsGrid.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {
  const queryParams = useQuery();
  const q = queryParams.get('q') || '';

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [q]);

  useEffect(() => {
    if (!q) {
      setArticles([]);
      setLoading(false);
      setHasMore(false);
      return;
    }

    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await searchNews(q, { page, pageSize: 12 });
        if (!isMounted) return;
        setArticles(data.articles || []);
        setHasMore((data.totalResults || 0) > page * 12);
      } catch (e) {
        if (!isMounted) return;
        setError(e.response?.data?.message || 'Failed to search news.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [q, page]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-10 pt-6 md:px-6">
      <section className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Search results for
          <span className="ml-2 rounded-full bg-slate-900 px-3 py-1 text-base font-semibold text-slate-50 dark:bg-slate-50 dark:text-slate-900">
            {q || '—'}
          </span>
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Browse stories that match your interest in real time.
        </p>
      </section>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/60 dark:text-red-200">
          {error}
        </div>
      )}

      {!q ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
          Enter a keyword in the search bar above to explore the latest coverage.
        </div>
      ) : loading ? (
        <LoadingSkeleton />
      ) : (
        <NewsGrid articles={articles} />
      )}

      {!loading && !error && q && (
        <div className="mt-8 flex items-center justify-between gap-4 text-sm">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-light dark:hover:text-brand-light"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500 dark:text-slate-400">Page {page}</span>
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

export default SearchPage;
