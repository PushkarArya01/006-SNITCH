import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatCurrency';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToBag = (product) => {
    const size = product.sizes?.[0] || 'M';
    addToCart(product, size, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="border-b border-zinc-200 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900">
            MY WISHLIST ({wishlist.length})
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
            Saved items ready for your wardrobe
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold uppercase tracking-wider">Your Wishlist is Empty</h2>
          <p className="text-xs text-zinc-500">
            Tap the heart icon on any product you love to save it here for later.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition"
          >
            Explore Latest Drops
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="group relative flex flex-col bg-white border border-zinc-200">
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full text-zinc-600 hover:text-red-500 transition shadow-sm cursor-pointer"
                  title="Remove from Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-semibold">{product.category}</p>
                  <Link
                    to={`/product/${product.id}`}
                    className="text-xs font-bold uppercase text-zinc-900 truncate block mt-0.5 hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs font-bold text-black mt-1">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <button
                  onClick={() => handleMoveToBag(product)}
                  className="mt-3 w-full py-2 bg-black hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
