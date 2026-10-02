import apiClient from './client';
import { MOCK_PRODUCTS } from '../data/mockProducts';

const MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false';

const normalizeProduct = (product) => ({
  ...product,
  id: product.id || product._id,
  name: product.name || product.title,
  price: typeof product.price === 'number' ? product.price : product.price?.amount,
  sizes: Array.isArray(product.sizes)
    ? product.sizes.map((size) => (typeof size === 'string' ? size : size.size))
    : [],
  inStock: product.inStock ?? product.sizes?.some((size) => size.stock > 0) ?? false,
});

export const productApi = {
  /**
   * Fetch all products with optional filters (category, search, sort, page)
   */
  async getProducts(params = {}) {
    try {
      const response = await apiClient.get('/products', { params });
      // Support common backend response structures: response.data.products or response.data
      const data = response.data?.data?.products || response.data?.products || response.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map(normalizeProduct);
      }
      if (Array.isArray(data)) {
        return [];
      }
      throw new Error('Empty backend product data, using fallback');
    } catch (err) {
      if (MOCK_FALLBACK) {
        console.info('[Snitch API] Backend unreachable or empty. Serving mock catalog.');
        let products = [...MOCK_PRODUCTS];

        if (params.category && params.category !== 'all') {
          products = products.filter(
            (p) => p.category.toLowerCase() === params.category.toLowerCase()
          );
        }

        if (params.search) {
          const q = params.search.toLowerCase();
          products = products.filter(
            (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
          );
        }

        if (params.sort) {
          if (params.sort === 'price-low') products.sort((a, b) => a.price - b.price);
          if (params.sort === 'price-high') products.sort((a, b) => b.price - a.price);
          if (params.sort === 'rating') products.sort((a, b) => b.rating - a.rating);
          if (params.sort === 'newest') products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        }

        return products;
      }
      throw err;
    }
  },

  /**
   * Fetch a single product by ID or Slug
   */
  async getProductById(id) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      const product = response.data?.data?.product || response.data?.product || response.data;
      return normalizeProduct(product);
    } catch (err) {
      if (MOCK_FALLBACK) {
        console.info(`[Snitch API] Fetching product ${id} from mock data`);
        const item = MOCK_PRODUCTS.find((p) => p.id === id || p.slug === id);
        if (item) return item;
      }
      throw err;
    }
  },

  /**
   * Fetch trending / bestseller drops
   */
  async getTrendingDrops() {
    try {
      const response = await apiClient.get('/products/trending');
      return response.data?.products || response.data;
    } catch {
      return MOCK_PRODUCTS.filter((p) => p.badge === 'TRENDING' || p.badge === 'BESTSELLER');
    }
  },
};
