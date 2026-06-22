import axios from 'axios';

const client = axios.create({
  baseURL: '/api/news'
});

export const fetchTopHeadlines = async ({ page = 1, pageSize = 12, country } = {}) => {
  const params = { page, pageSize };
  if (country) {
    params.country = country;
  }
  const { data } = await client.get('/', { params });
  return data;
};

export const fetchByCategory = async (category, { page = 1, pageSize = 12, country } = {}) => {
  const params = { page, pageSize };
  if (country) {
    params.country = country;
  }
  const { data } = await client.get(`/category/${encodeURIComponent(category)}`, {
    params
  });
  return data;
};

export const searchNews = async (query, { page = 1, pageSize = 12 } = {}) => {
  const { data } = await client.get(`/search/${encodeURIComponent(query)}`, {
    params: { page, pageSize }
  });
  return data;
};

export const fetchArticleById = async (id) => {
  const { data } = await client.get(`/${encodeURIComponent(id)}`);
  return data;
};
