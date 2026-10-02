import { useState, useEffect, useCallback } from 'react';
import { productApi } from '../api/productApi';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productApi.getProducts(params);
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(initialParams);
  }, [JSON.stringify(initialParams), fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};
