import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { NAV_LINKS } from '../../utils/constants';

const Navbar = ({ onOpenSearch }) => {
  const { openCart, totalItemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left: Mobile Hamburger & Desktop Links */}
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1 text-black cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Logo */}
              <Link
                to="/"
                className="text-2xl sm:text-3xl font-black tracking-[0.25em] text-black uppercase select-none hover:opacity-90"
              >
                SNITCH
              </Link>
            </div>

            {/* Desktop Navigation Category Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-xs font-bold tracking-widest uppercase text-zinc-800 hover:text-black hover:border-b-2 hover:border-black py-1 transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right: Actions Icons */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Search Icon */}
              <button
                onClick={onOpenSearch}
                aria-label="Search"
                className="p-1.5 text-zinc-700 hover:text-black transition cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="relative p-1.5 text-zinc-700 hover:text-black transition cursor-pointer"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Account / Auth */}
              <div className="relative">
                {isAuthenticated ? (
                  <div>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="p-1.5 text-zinc-700 hover:text-black flex items-center space-x-1 cursor-pointer"
                    >
                      <User className="w-5 h-5" />
                      <span className="hidden sm:inline text-xs font-bold uppercase truncate max-w-[80px]">
                        {user?.name?.split(' ')[0]}
                      </span>
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 shadow-xl py-2 z-50 animate-fade-in">
                        <div className="px-4 py-2 border-b border-zinc-100">
                          <p className="text-xs font-bold text-black uppercase truncate">{user?.name}</p>
                          <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 uppercase"
                        >
                          My Orders & Account
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-zinc-100 uppercase flex items-center"
                        >
                          <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="p-1.5 text-zinc-700 hover:text-black transition cursor-pointer"
                    aria-label="Sign In"
                  >
                    <User className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCart}
                aria-label="Open Cart Bag"
                className="relative p-1.5 text-zinc-700 hover:text-black transition cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-white px-6 py-4 space-y-3 animate-fade-in">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-bold tracking-widest uppercase text-zinc-900 hover:text-black py-1.5 border-b border-zinc-100"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-bold tracking-widest uppercase text-zinc-900 py-1.5"
            >
              Saved Wishlist ({wishlistCount})
            </Link>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
