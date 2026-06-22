import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ article }) => {
  const navigate = useNavigate();

  const handleOpenDetails = () => {
    if (article?._id) {
      navigate(`/article/${article._id}`, { state: { fallbackArticle: article } });
    } else {
      navigate('/article', { state: { fallbackArticle: article } });
    }
  };

  const published = article.publishedAt ? new Date(article.publishedAt) : null;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpenDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleOpenDetails();
        }
      }}
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card outline-none transition hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-brand dark:border-slate-800 dark:bg-slate-900"
    >
      {article.image && (
        <div className="relative h-44 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {article.source || 'Unknown Source'}
          </span>
          {article.category && (
            <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-brand dark:text-brand-light">
              {article.category}
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold leading-snug md:text-base">
          {article.title}
        </h3>

        {article.description && (
          <p className="line-clamp-3 text-xs text-slate-600 dark:text-slate-300 md:text-sm">
            {article.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-1 text-[0.7rem] text-slate-500 dark:text-slate-400">
          {published && <span>{published.toLocaleString()}</span>}
          <span className="inline-flex items-center gap-1 text-[0.65rem] font-semibold uppercase tracking-wide text-brand dark:text-brand-light">
            Read more
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
