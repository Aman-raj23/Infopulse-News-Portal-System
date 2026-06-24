import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { useCountry } from '../context/CountryContext.jsx';

const categories = ['business', 'sports', 'technology', 'health', 'entertainment', 'science'];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { country, setCountry } = useCountry();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-slate-50/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <div className="flex flex-1 items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-900 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand to-brand-light text-white shadow-card">
              <span className="text-lg font-semibold">IP</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-tight md:text-lg">InfoPulse</span>
              <span className="text-[0.7rem] text-slate-500 dark:text-slate-400 md:text-xs">
                Real-time News Pulse
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors hover:text-brand dark:hover:text-brand-light ${
                isActive
                  ? 'text-brand dark:text-brand-light'
                  : 'text-slate-600 dark:text-slate-300'
              }`
            }
          >
            Home
          </NavLink>

          <div className="relative">
            <button
              type="button"
              onClick={() => setCategoriesOpen((prev) => !prev)}
              className="flex items-center gap-1 text-slate-600 transition-colors hover:text-brand dark:text-slate-200 dark:hover:text-brand-light"
            >
              Categories
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div
              className={`absolute left-0 top-full mt-2 min-w-[10rem] rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 transition dark:border-slate-800 dark:bg-slate-900 ${
                categoriesOpen ? 'opacity-100 visible translate-y-0' : 'invisible opacity-0 -translate-y-1'
              }`}
            >
              {categories.map((cat) => (
                <NavLink
                  key={cat}
                  to={`/category/${cat}`}
                  onClick={() => setCategoriesOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm capitalize transition-colors hover:bg-slate-50 hover:text-brand dark:hover:bg-slate-800 dark:hover:text-brand-light ${
                      isActive
                        ? 'bg-slate-50 text-brand dark:bg-slate-800 dark:text-brand-light'
                        : 'text-slate-600 dark:text-slate-300'
                    }`
                  }
                >
                  {cat}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="hidden flex-1 items-center gap-2 md:flex"
        >
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-slate-400">
              <svg
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 104 10.5a6.5 6.5 0 0013 0z" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search headlines, topics, companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm shadow-sm outline-none ring-brand/10 transition focus:border-brand focus:ring-2 dark:border-slate-800 dark:bg-slate-900"
            />
          </div>
          <button
            type="submit"
            className="hidden shrink-0 rounded-full bg-gradient-to-tr from-brand to-brand-light px-4 py-2 text-sm font-medium text-white shadow-card transition hover:shadow-lg md:inline-flex"
          >
            Search
          </button>
        </form>

        <div className="flex gap-1 rounded-full bg-white/80 p-1 text-[0.7rem] shadow-sm ring-1 ring-slate-200 dark:bg-slate-900/70 dark:ring-slate-700">
          {[
            { value: 'in', label: '🇮🇳 IN' },
            { value: 'us', label: '🇺🇸 US' }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setCountry(option.value)}
              className={`rounded-full px-2.5 py-1 font-semibold transition ${
                country === option.value
                  ? 'bg-gradient-to-tr from-brand to-brand-light text-white shadow-card'
                  : 'text-slate-500 hover:text-brand dark:text-slate-300 dark:hover:text-brand-light'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-light dark:hover:text-brand-light"
        >
          {theme === 'dark' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 3v2.25M18.364 5.636l-1.59 1.59M21 12h-2.25M18.364 18.364l-1.59-1.59M12 18.75V21M7.226 16.774l-1.59 1.59M5.25 12H3M7.226 7.226l-1.59-1.59M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 pb-4 pt-2 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="mb-2 flex flex-col gap-2">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-2 py-2 font-medium transition-colors hover:bg-slate-100 hover:text-brand dark:hover:bg-slate-900 dark:hover:text-brand-light ${
                  isActive
                    ? 'bg-slate-100 text-brand dark:bg-slate-900 dark:text-brand-light'
                    : 'text-slate-700 dark:text-slate-200'
                }`
              }
            >
              Home
            </NavLink>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <NavLink
                  key={cat}
                  to={`/category/${cat}`}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-2 py-2 text-xs capitalize transition-colors hover:bg-slate-100 hover:text-brand dark:hover:bg-slate-900 dark:hover:text-brand-light ${
                      isActive
                        ? 'bg-slate-100 text-brand dark:bg-slate-900 dark:text-brand-light'
                        : 'text-slate-700 dark:text-slate-200'
                    }`
                  }
                >
                  {cat}
                </NavLink>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="search"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/10 transition focus:border-brand focus:ring-2 dark:border-slate-800 dark:bg-slate-900"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gradient-to-tr from-brand to-brand-light px-4 py-2 text-xs font-semibold text-white shadow-card"
            >
              Go
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;
