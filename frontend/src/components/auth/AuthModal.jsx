import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login, register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMode === 'login') {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
      }
      setSuccess(authMode === 'login' ? 'Logged in successfully!' : 'Account registered successfully!');
      setTimeout(() => {
        closeAuthModal();
        setSuccess('');
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login({ email: 'cohort.developer@snitch.com', password: 'password123' });
      setSuccess('Logged in as Cohort Demo User!');
      setTimeout(() => {
        closeAuthModal();
        setSuccess('');
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md border border-zinc-200 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 p-1 text-zinc-400 hover:text-black transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="grid grid-cols-2 border-b border-zinc-200 text-center font-bold text-xs uppercase tracking-widest">
          <button
            onClick={() => setAuthMode('login')}
            className={`py-4 transition-colors cursor-pointer ${
              authMode === 'login'
                ? 'border-b-2 border-black text-black bg-zinc-50/50'
                : 'text-zinc-400 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`py-4 transition-colors cursor-pointer ${
              authMode === 'register'
                ? 'border-b-2 border-black text-black bg-zinc-50/50'
                : 'text-zinc-400 hover:text-black'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold tracking-tight uppercase">
              {authMode === 'login' ? 'Welcome to Snitch' : 'Join the Snitch Club'}
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {authMode === 'login'
                ? 'Sign in to access your bag, saved wishlist, and orders'
                : 'Unlock exclusive member drops, early sale access & free delivery'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ankur Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-300 focus:border-black outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-300 focus:border-black outline-none transition"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@domain.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-300 focus:border-black outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-300 focus:border-black outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-4 border-t border-zinc-200">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              ⚡ Quick Demo User Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
