const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    image: { type: String },
    source: { type: String },
    author: { type: String },
    url: { type: String },
    publishedAt: { type: Date },
    category: { type: String },
    query: { type: String },
    country: { type: String },
    fullContent: { type: String },
    fullContentFetchedAt: { type: Date },
    // Cache metadata
    fetchedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

// Index for fast lookups scoped by country/category/query and published date
newsSchema.index({ country: 1, category: 1, query: 1, publishedAt: -1 });

module.exports = mongoose.model('News', newsSchema);
