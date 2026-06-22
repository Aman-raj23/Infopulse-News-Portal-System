# InfoPulse 

A modern, full-stack MERN news portal that surfaces real-time headlines from a third-party news API, with MongoDB caching, category browsing, keyword search, dark/light mode, and a responsive, Tailwind-powered UI.

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Tailwind CSS
- **Backend**: Node.js, Express.js, Axios
- **Database**: MongoDB with Mongoose
- **External API**: [NewsAPI.org](https://newsapi.org/) (or any News API with a similar interface)

---

## Project Structure

```text
InfoPulse/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── newsController.js
│   ├── middleware/
│   │   └── errorMiddleware.js
│   ├── models/
│   │   └── News.js
│   ├── routes/
│   │   └── newsRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.mjs
│   └── src/
│       ├── api/
│       │   └── newsApi.js
│       ├── components/
│       │   ├── LoadingSkeleton.jsx
│       │   ├── Navbar.jsx
│       │   ├── NewsCard.jsx
│       │   └── NewsGrid.jsx
│       ├── context/
│       │   └── ThemeContext.jsx
│       ├── pages/
│       │   ├── ArticleDetailsPage.jsx
│       │   ├── CategoryPage.jsx
│       │   ├── HomePage.jsx
│       │   └── SearchPage.jsx
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
└── README.md
```

---

## Backend Setup (Express + MongoDB)

1. **Install dependencies**

```bash
cd backend
npm install
```

2. **Configure environment variables**

Create a `.env` file in `backend/` based on `.env.example`:

```bash
cp .env.example .env
```

Then edit `.env`:

- `MONGODB_URI` – your MongoDB connection string
- `NEWS_API_KEY` – your News API key from NewsAPI.org (or similar provider)
- Optional: tweak `PORT`, `CACHE_TTL_MINUTES`, `NEWS_API_BASE_URL`

3. **Run the backend server (development)**

```bash
npm run dev
```

The backend will start (by default) on `http://localhost:5000` and expose:

- `GET /api/news` – top headlines (supports `?page=&pageSize=`)
- `GET /api/news/category/:category` – category headlines
- `GET /api/news/search/:query` – full-text search

### MongoDB Schema (News)

The `News` model (`backend/models/News.js`) includes:

- `title: string`
- `description: string`
- `content: string`
- `image: string`
- `source: string`
- `url: string`
- `publishedAt: Date`
- `category: string | null`
- `query: string | null` (search keyword)
- `fetchedAt: Date` (cache timestamp)

An index on `{ category, query, publishedAt }` is used to keep lookups efficient.

### Caching Strategy

- When a request comes in for top headlines, category, or search:
  - The backend first looks in MongoDB for the latest documents matching that scope.
  - If there is fresh data (`fetchedAt` within `CACHE_TTL_MINUTES`), it returns the **cached** articles.
  - Otherwise, it calls the external News API via Axios, **upserts** the articles into MongoDB, then returns them.

This reduces external API calls and speeds up repeated requests.

---

## Frontend Setup (React + Tailwind)

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Run the development server**

```bash
npm run dev
```

The app will run at `http://localhost:5173`. The Vite dev server is configured to proxy `/api` requests to `http://localhost:5000`, so make sure the backend is running.

### Tailwind CSS

Tailwind is configured via `tailwind.config.js` and `postcss.config.js`. The main stylesheet `src/index.css` wires Tailwind layers and some global styling.

IDE warnings about `@tailwind` or `@apply` are expected unless your editor is Tailwind-aware; Vite will compile these correctly at runtime.

---

## Frontend Features

- **Navbar**
  - Brand logo and tagline
  - Home link
  - Categories dropdown: Business, Sports, Technology, Health, Entertainment, Science
  - Search bar (desktop & mobile)
  - Dark/light mode toggle (persists in `localStorage`)

- **Home Page**
  - Fetches `/api/news` and displays top headlines in responsive cards
  - Each card shows image, title, description, source, category, and published date
  - Pagination via **Previous/Next** buttons
  - Skeleton loaders while fetching
  - Error message if API fails

- **Category Pages**
  - Route: `/category/:category`
  - Fetches `/api/news/category/:category`
  - Same layout as Home with category-specific copy and pagination

- **Search Page**
  - Route: `/search?q=keyword`
  - Uses `/api/news/search/:query`
  - Shows loading skeleton, error handling, and pagination

- **Article Details Page**
  - Route: `/article` (navigated via React state from cards)
  - Shows title, image, full content (if available), author, source, category, published date
  - Button to open original article in a new tab
  - Graceful fallback if accessed without article state

- **Dark/Light Mode**
  - Implemented via `ThemeContext` with `darkMode: 'class'` in Tailwind
  - Persists user preference in `localStorage`
  - Respects system preference on first load

---

## Production Considerations

- Use environment-specific configs for:
  - Backend `MONGODB_URI`, `NEWS_API_KEY`, `PORT`, `NODE_ENV`
  - Frontend API base URL / proxy when deploying
- Ensure HTTPS and proper CORS configuration in production environments.
- Consider rate limits and quotas of the News API provider; cache TTL can be tuned via `CACHE_TTL_MINUTES`.
- For deployment:
  - Build the frontend with `npm run build` in `frontend/`.
  - Serve the static build from a CDN or separate host, or integrate into the backend as needed.

---

## Scripts

### Backend

- `npm run dev` – start Express with nodemon
- `npm start` – start Express for production

### Frontend

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview production build locally

---

## Notes

- The codebase is structured to be readable and production-ready, with clear separation of concerns:
  - Routes → Controllers → Models for the backend
  - API layer → Pages → Components → Context for the frontend
- Favorite articles, user accounts, and more advanced analytics/history can be added later using the existing MongoDB foundation.
