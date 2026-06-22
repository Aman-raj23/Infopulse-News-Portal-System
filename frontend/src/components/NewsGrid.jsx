import React from 'react';
import NewsCard from './NewsCard.jsx';

const NewsGrid = ({ articles }) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
        <p className="mb-1 font-medium">No articles found</p>
        <p className="text-xs">Try a different keyword or category.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <NewsCard key={`${article.url}-${article.publishedAt}`} article={article} />
      ))}
    </div>
  );
};

export default NewsGrid;
