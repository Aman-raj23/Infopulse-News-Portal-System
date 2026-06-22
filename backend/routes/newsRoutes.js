const express = require('express');
const router = express.Router();
const {
  getTopHeadlines,
  getNewsByCategory,
  searchNews,
  getArticleById
} = require('../controllers/newsController');

// GET /api/news - top headlines
router.get('/', getTopHeadlines);

// GET /api/news/category/:category - by category
router.get('/category/:category', getNewsByCategory);

// GET /api/news/search/:query - search by keyword
router.get('/search/:query', searchNews);

// GET /api/news/:id - get single article with full content
router.get('/:id', getArticleById);

module.exports = router;
