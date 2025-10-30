import axios from 'axios';

// Supabase - products için axios üzerinden REST API
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseApi = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  // Tüm ürünler
  getAll: () => supabaseApi.get('/products', { params: { select: '*' } }),

  // ID ile ürün
  getById: async (id) => {
    const res = await supabaseApi.get('/products', {
      params: { id: `eq.${id}`, select: '*' },
    });
    return { data: res.data?.[0] ?? null };
  },

  // Kategoriye göre ürünler
  getByCategory: (category) =>
    supabaseApi.get('/products', {
      params: { category: `eq.${category}`, select: '*' },
    }),

  // Birden fazla ID ile ürünleri getir
  getManyByIds: (ids) => {
    if (!ids || ids.length === 0) return Promise.resolve({ data: [] });
    const list = ids.join(',');
    return supabaseApi.get('/products', {
      params: { id: `in.(${list})`, select: '*' },
    });
  },
};

// Users API
export const usersAPI = {};

// Orders API
export const ordersAPI = {
  create: (order) => supabaseApi.post('/orders', order),
  getByUser: (userName) =>
    supabaseApi.get('/orders', { params: { user_name: `eq.${userName}`, select: '*' } }),
  getById: (id) => supabaseApi.get('/orders', { params: { id: `eq.${id}`, select: '*' } }),
};

// Wishlist API
export const wishlistAPI = {
  getByUser: (userName) =>
    supabaseApi.get('/wishlist', { params: { user_name: `eq.${userName}`, select: '*' } }),
  add: (entry) => supabaseApi.post('/wishlist', entry), // { user_name, product_id }
  remove: (userName, productId) =>
    supabaseApi.delete('/wishlist', { params: { user_name: `eq.${userName}`, product_id: `eq.${productId}` } }),
};

// Cart API (Supabase)
export const cartAPI = {
  getByUser: (userName) =>
    supabaseApi.get('/cart', {
      params: { user_name: `eq.${userName}`, select: '*' },
    }),

  add: (entry) => supabaseApi.post('/cart', entry), // { user_name, product_id, quantity }

  updateQuantity: (userName, productId, quantity) =>
    supabaseApi.patch('/cart', { quantity }, {
      params: { user_name: `eq.${userName}`, product_id: `eq.${productId}` },
    }),

  remove: (userName, productId) =>
    supabaseApi.delete('/cart', {
      params: { user_name: `eq.${userName}`, product_id: `eq.${productId}` },
    }),
};

export default { supabaseApi };
