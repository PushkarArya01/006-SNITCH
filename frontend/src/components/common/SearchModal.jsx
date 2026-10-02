import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { productApi } from '../../api/productApi';
import { formatPrice } from '../../utils/formatCurrency';

const TRENDING_TAGS = ['Linen Shirts', 'Oversized Tees', 'Baggy Jeans', 'Cargo Pants', 'Perfumes', 'Polo'];

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 250);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      try {
        const data = await productApi.getProducts({ search: debouncedSearch });
        setResults(data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearch]);

  if (!isOpen) return null;

  const handleSelectProduct = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleViewAll = () => {
    onClose();
    navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-16 px-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-none shadow-2xl overflow-hidden border border-zinc-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-zinc-200">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for shirts, oversized tees, cargos, fragrances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchTerm.trim()) {
                handleViewAll();
              }
            }}
            className="w-full text-base font-medium outline-none placeholder:text-zinc-400 placeholder:font-normal"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 mr-2 text-zinc-400 hover:text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-widest font-bold text-zinc-500 hover:text-black px-2 py-1 cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Trending Searches Tags */}
          {!searchTerm && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-1.5 text-xs font-medium bg-zinc-100 hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-8 text-center text-sm text-zinc-500">
              Searching Snitch catalog...
            </div>
          )}

          {/* Search Results */}
          {!isLoading && searchTerm && results.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Products ({results.length})
                </p>
                <button
                  onClick={handleViewAll}
                  className="text-xs font-semibold uppercase tracking-wider text-black flex items-center hover:underline cursor-pointer"
                >
                  View All Results <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="flex items-center space-x-3 p-2 hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition cursor-pointer"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-20 object-cover bg-zinc-100 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-900 truncate uppercase">
                        {product.name}
                      </p>
                      <p className="text-xs text-zinc-500 capitalize">{product.fit || product.category}</p>
                      <p className="text-xs font-bold text-black mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {!isLoading && searchTerm && results.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-zinc-700">No products found matching "{searchTerm}"</p>
              <p className="text-xs text-zinc-400 mt-1">Try checking for spelling or searching for generic terms like 'shirt' or 'tee'</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
