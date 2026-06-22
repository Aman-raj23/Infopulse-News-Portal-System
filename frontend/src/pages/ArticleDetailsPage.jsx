import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fetchArticleById } from '../api/newsApi.js';

const ArticleDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fallbackArticle = location.state?.fallbackArticle || location.state?.article || null;

  const [article, setArticle] = useState(fallbackArticle);
  const [loading, setLoading] = useState(Boolean(id) && !fallbackArticle);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { article: fresh } = await fetchArticleById(id);
        if (!isMounted) return;
        setArticle(fresh);
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || 'Failed to load this article.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const published = article?.publishedAt ? new Date(article.publishedAt) : null;

  const bodyParagraphs = useMemo(() => {
    if (!article) return null;
    const body = article.fullContent || article.content;
    if (!body) return null;
    return body.split(/\n{1,2}/).map((block) => block.trim()).filter(Boolean);
  }, [article]);

  if (loading && !article) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-10 pt-6 md:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 shadow-card dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <p className="mb-2 font-semibold">Loading article...</p>
          <p>Please hold on while we fetch the full story.</p>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-10 pt-6 md:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <p className="mb-4 font-medium">{error || 'No article data available.'}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-brand"
            >
              Go back
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-14 pt-6 md:px-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-light dark:hover:text-brand-light"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {error && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200">
          {error} You can still open the original article below.
        </div>
      )}

      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900">
        {article.image && (
          <div className="relative h-72 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
            <img
              src={article.image}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {article.source && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {article.source}
              </span>
            )}
            {article.category && (
              <span className="rounded-full bg-brand/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-wide text-brand dark:bg-brand/20 dark:text-brand-light">
                {article.category}
              </span>
            )}
            {published && <span>{published.toLocaleString()}</span>}
            {article.author && <span>By {article.author}</span>}
          </div>

          <h1 className="mb-4 text-2xl font-semibold leading-snug tracking-tight md:text-3xl">
            {article.title}
          </h1>

          {article.description && (
            <p className="mb-4 text-base text-slate-700 dark:text-slate-200">
              {article.description}
            </p>
          )}

          {bodyParagraphs ? (
            <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {bodyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Full text is not available for this article. Use the link below to read it at the original source.
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Powered by cached data from the InfoPulse API.
            </span>
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-gradient-to-tr from-brand to-brand-light px-4 py-2 text-xs font-semibold text-white shadow-card transition hover:shadow-lg"
              >
                Open original
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13.5 6H18m0 0v4.5M18 6l-6 6M9.75 6.75H7.5A1.5 1.5 0 006 8.25v8.25A1.5 1.5 0 007.5 18h8.25a1.5 1.5 0 001.5-1.5v-2.25"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </article>
    </main>
  );
};

export default ArticleDetailsPage;
