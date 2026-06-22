const axios = require('axios');
const cheerio = require('cheerio');
const News = require('../models/News');

const NEWS_API_BASE_URL = process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2';
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const CACHE_TTL_MINUTES = parseInt(process.env.CACHE_TTL_MINUTES || '10', 10);
const DEFAULT_COUNTRY = (() => {
  const fromEnv = (process.env.NEWS_API_DEFAULT_COUNTRY || '').trim().toLowerCase();
  if (fromEnv) return fromEnv;
  return 'us';
})();
const FULL_CONTENT_TTL_MINUTES = parseInt(process.env.FULL_CONTENT_TTL_MINUTES || '720', 10);

if (!NEWS_API_KEY) {
  console.warn('WARNING: NEWS_API_KEY is not set. External news fetching will fail until it is configured.');
}

const normalizeCountryParam = (value) => {
  if (!value) return null;
  const trimmed = value.trim().toLowerCase();
  return trimmed || null;
};

// Helper: determine if cached data is still fresh
const isCacheFresh = (fetchedAt) => {
  if (!fetchedAt) return false;
  const ageMs = Date.now() - new Date(fetchedAt).getTime();
  return ageMs <= CACHE_TTL_MINUTES * 60 * 1000;
};

// Helper: build NewsAPI request
const fetchFromNewsAPI = async ({ endpoint, params }) => {
  const url = `${NEWS_API_BASE_URL}${endpoint}`;

  const defaultParams = endpoint === '/everything' ? { language: 'en' } : {};

  const response = await axios.get(url, {
    params: {
      apiKey: NEWS_API_KEY,
      ...defaultParams,
      ...params
    }
  });

  return response.data;
};

const extractReadableText = (html) => {
  if (!html) return null;
  const $ = cheerio.load(html);
  const blocks = [];

  $('article p, .article-content p, .post-content p, p').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.length >= 60) {
      blocks.push(text);
    }
    if (blocks.length >= 25) return false;
  });

  if (blocks.length === 0) return null;
  return blocks.join('\n\n');
};

const fetchFullArticleContent = async (url) => {
  if (!url) return null;
  try {
    const { data } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36'
      }
    });

    return extractReadableText(data);
  } catch (error) {
    console.warn(`Failed to fetch full article from ${url}: ${error.message}`);
    return null;
  }
};

const needsFullContentRefresh = (article) => {
  if (!article) return false;
  if (!article.fullContent || !article.fullContentFetchedAt) return true;
  const ageMs = Date.now() - new Date(article.fullContentFetchedAt).getTime();
  return ageMs > FULL_CONTENT_TTL_MINUTES * 60 * 1000;
};

// Helper: normalize and upsert articles into MongoDB
const upsertArticles = async ({ articles, country = null, category = null, query = null }) => {
  if (!Array.isArray(articles) || articles.length === 0) return [];

  const operations = articles.map((article) => {
    const publishedAt = article.publishedAt ? new Date(article.publishedAt) : null;

    const filter = {
      title: article.title,
      source: article.source?.name,
      author: article.author,
      publishedAt,
      country: country || null,
      category: category || null,
      query: query || null
    };

    const update = {
      title: article.title,
      description: article.description,
      content: article.content,
      image: article.urlToImage,
      source: article.source?.name,
      author: article.author,
      url: article.url,
      publishedAt,
      country: country || null,
      category: category || null,
      query: query || null,
      fetchedAt: new Date()
    };

    return {
      updateOne: {
        filter,
        update: { $set: update },
        upsert: true
      }
    };
  });

  if (operations.length > 0) {
    await News.bulkWrite(operations, { ordered: false });
  }

  // Re-read from DB to return consistent shape
  const titles = articles.map((a) => a.title).filter(Boolean);

  const normalized = await News.find({
    title: { $in: titles },
    country: country || null,
    category: category || null,
    query: query || null
  })
    .sort({ publishedAt: -1 })
    .lean();

  return normalized;
};

// GET /api/news
const getTopHeadlines = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '12', 10);
    const country = normalizeCountryParam(req.query.country) || DEFAULT_COUNTRY;

    const latest = await News.find({ country: country || null, category: null, query: null })
      .sort({ fetchedAt: -1 })
      .limit(pageSize)
      .lean();

    if (latest.length > 0 && isCacheFresh(latest[0].fetchedAt)) {
      return res.json({
        source: 'cache',
        page,
        pageSize,
        totalResults: latest.length,
        articles: latest
      });
    }

    if (!NEWS_API_KEY) {
      return res.status(500).json({
        message: 'NEWS_API_KEY is not configured on the server and no cached data is available.'
      });
    }

    const params = {
      page,
      pageSize,
      country
    };

    let data = await fetchFromNewsAPI({
      endpoint: '/top-headlines',
      params
    });

    if ((data.totalResults === 0 || !data.articles?.length) && country) {
      console.warn(`No articles returned for country=${country}. Falling back to global headlines.`);
      data = await fetchFromNewsAPI({
        endpoint: '/top-headlines',
        params: { page, pageSize }
      });
    }

    const articles = await upsertArticles({
      articles: data.articles,
      country: (data.totalResults === 0 || !data.articles?.length) ? null : country,
      category: null,
      query: null
    });

    res.json({
      source: 'api',
      page,
      pageSize,
      totalResults: data.totalResults,
      articles
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/news/category/:category
const getNewsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const normalizedCategory = category.toLowerCase();
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '12', 10);
    const country = normalizeCountryParam(req.query.country) || DEFAULT_COUNTRY;

    const latest = await News.find({ country: country || null, category: normalizedCategory, query: null })
      .sort({ fetchedAt: -1 })
      .limit(pageSize)
      .lean();

    if (latest.length > 0 && isCacheFresh(latest[0].fetchedAt)) {
      return res.json({
        source: 'cache',
        page,
        pageSize,
        totalResults: latest.length,
        articles: latest
      });
    }

    if (!NEWS_API_KEY) {
      return res.status(500).json({
        message: 'NEWS_API_KEY is not configured on the server and no cached data is available.'
      });
    }

    const params = {
      category: normalizedCategory,
      page,
      pageSize
    };

    if (country) {
      params.country = country;
    }

    const data = await fetchFromNewsAPI({
      endpoint: '/top-headlines',
      params
    });

    const articles = await upsertArticles({
      articles: data.articles,
      country,
      category: normalizedCategory,
      query: null
    });

    res.json({
      source: 'api',
      page,
      pageSize,
      totalResults: data.totalResults,
      articles
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/news/search/:query
const searchNews = async (req, res, next) => {
  try {
    const { query } = req.params;
    const trimmedQuery = query.trim();
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = parseInt(req.query.pageSize || '12', 10);

    const latest = await News.find({ country: null, query: trimmedQuery })
      .sort({ fetchedAt: -1 })
      .limit(pageSize)
      .lean();

    if (latest.length > 0 && isCacheFresh(latest[0].fetchedAt)) {
      return res.json({
        source: 'cache',
        page,
        pageSize,
        totalResults: latest.length,
        articles: latest
      });
    }

    if (!NEWS_API_KEY) {
      return res.status(500).json({
        message: 'NEWS_API_KEY is not configured on the server and no cached data is available.'
      });
    }

    const data = await fetchFromNewsAPI({
      endpoint: '/everything',
      params: {
        q: trimmedQuery,
        sortBy: 'publishedAt',
        page,
        pageSize
      }
    });

    const articles = await upsertArticles({
      articles: data.articles,
      country: null,
      category: null,
      query: trimmedQuery
    });

    res.json({
      source: 'api',
      page,
      pageSize,
      totalResults: data.totalResults,
      articles
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/news/:id
const getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await News.findById(id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    if (needsFullContentRefresh(article)) {
      const fullContent = await fetchFullArticleContent(article.url);
      if (fullContent) {
        article.fullContent = fullContent;
        article.fullContentFetchedAt = new Date();
        await article.save();
      }
    }

    res.json({ article });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTopHeadlines,
  getNewsByCategory,
  searchNews,
  getArticleById
};
