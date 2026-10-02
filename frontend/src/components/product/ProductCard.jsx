import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Check } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [addedSize, setAddedSize] = useState(null);

  const isFavorited = isInWishlist(product.id);
  const discount = calculateDiscount(product.originalPrice, product.price);

  const handleQuickAdd = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, 1);
    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 1500);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800';
  const hoverImage = product.images?.[1] || mainImage;

  return (
    <div
      className="group relative flex flex-col bg-white select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={isHovered ? hoverImage : mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Product Tag / Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2 z-10 bg-black text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label="Save to Wishlist"
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-black shadow-sm transition-all duration-200 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-zinc-700 hover:text-black'
            }`}
          />
        </button>

        {/* Quick Size Select Bar (Appears on Hover) */}
        <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 border-t border-zinc-200">
          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 text-center mb-1.5">
            Quick Add Size
          </p>
          <div className="flex justify-center gap-1.5">
            {product.sizes?.map((size) => (
              <button
                key={size}
                onClick={(e) => handleQuickAdd(e, size)}
                className={`min-w-[28px] h-7 px-1 text-[11px] font-semibold border flex items-center justify-center transition-all cursor-pointer ${
                  addedSize === size
                    ? 'bg-black text-white border-black'
                    : 'border-zinc-300 hover:border-black hover:bg-black hover:text-white'
                }`}
              >
                {addedSize === size ? <Check className="w-3 h-3" /> : size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Info */}
      <div className="pt-3 pb-1 flex flex-col flex-1">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
          <span>{product.fit || product.category}</span>
          {product.rating && (
            <span className="flex items-center text-zinc-700 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
              {product.rating}
            </span>
          )}
        </div>

        <Link
          to={`/product/${product.id}`}
          className="text-xs font-semibold text-zinc-900 uppercase tracking-tight line-clamp-1 hover:underline"
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="mt-1.5 flex items-center space-x-2">
          <span className="text-xs font-bold text-black">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-[11px] text-zinc-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">
                ({discount}% OFF)
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
