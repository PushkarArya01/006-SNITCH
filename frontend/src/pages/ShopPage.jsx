import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, RefreshCcw } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productApi } from '../api/productApi';
import { CATEGORIES } from '../utils/constants';

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Newest Arrivals', value: 'newest' },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'featured';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState(initialSort);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProducts({
          category: activeCategory !== 'all' ? activeCategory : undefined,
          search: searchQuery || undefined,
          sort: selectedSort,
        });
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [activeCategory, searchQuery, selectedSort]);

  const handleCategoryChange = (catId) => {
    const next = new URLSearchParams(searchParams);
    if (catId === 'all') {
      next.delete('category');
    } else {
      next.set('category', catId);
    }
    setSearchParams(next);
  };

  const handleSortChange = (e) => {
    const sortVal = e.target.value;
    setSelectedSort(sortVal);
    const next = new URLSearchParams(searchParams);
    next.set('sort', sortVal);
    setSearchParams(next);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setSelectedSort('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Breadcrumb header */}
      <div className="border-b border-zinc-200 pb-6 mb-8">
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-zinc-900">
          {searchQuery ? `SEARCH: "${searchQuery}"` : activeCategory === 'all' ? 'ALL COLLECTIONS' : activeCategory}
        </h1>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
          Showing {products.length} Products | Snitch Official Store
        </p>
      </div>

      {/* Category Filter Pills & Sorting Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
            }`}
          >
            All Products
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-black text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-3 self-end lg:self-auto">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-zinc-600">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Sort By:</span>
          </div>
          <select
            value={selectedSort}
            onChange={handleSortChange}
            className="text-xs font-semibold uppercase bg-zinc-50 border border-zinc-300 py-2 px-3 outline-none cursor-pointer focus:border-black"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="aspect-[3/4] bg-zinc-200" />
              <div className="h-4 bg-zinc-200 w-3/4" />
              <div className="h-3 bg-zinc-200 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <p className="text-base font-bold uppercase text-zinc-800">
            No products match your criteria
          </p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search terms or filter selection to find what you're looking for.
          </p>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
