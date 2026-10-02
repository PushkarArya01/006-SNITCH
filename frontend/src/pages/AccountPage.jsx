import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Package, MapPin, LogOut, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { orderApi } from "../api/orderApi";
import { formatPrice } from "../utils/formatCurrency";

const AccountPage = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal("login");
    }

    const fetchOrders = async () => {
      try {
        const data = await orderApi.getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <User className="w-12 h-12 mx-auto text-zinc-400" />
        <h2 className="text-lg font-bold uppercase">Please Sign In</h2>
        <p className="text-xs text-zinc-500">
          Sign in to view your orders, addresses, and wishlist.
        </p>
        <button
          onClick={() => openAuthModal("login")}
          className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="border-b border-zinc-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900">
            MY ACCOUNT
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
            Logged in as <strong className="text-black">{user?.name}</strong> (
            {user?.email})
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2 border border-zinc-300 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-black hover:border-black cursor-pointer self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Profile Information Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border border-zinc-200 p-6 bg-zinc-50/50 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-base">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase text-black">
                  {user?.name}
                </h3>
                <p className="text-xs text-zinc-500">{user?.email}</p>
                {user?.phone && (
                  <p className="text-xs text-zinc-500">{user?.phone}</p>
                )}
              </div>
            </div>
            <div className="pt-3 border-t border-zinc-200 text-xs text-zinc-600">
              <p>
                Member Status:{" "}
                <span className="font-bold text-black uppercase">
                  Snitch Club Gold
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Orders History */}
        <div className="lg:col-span-8">
          <div className="border border-zinc-200 p-6 bg-white">
            <div className="flex items-center space-x-2 border-b border-zinc-200 pb-4 mb-6">
              <Package className="w-4 h-4 text-black" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-black">
                My Orders & Shipments ({orders.length})
              </h2>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-zinc-400">
                Loading order history...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-sm font-bold uppercase text-zinc-800">
                  No Orders Yet
                </p>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  When you place an order, you will be able to track your
                  package status right here.
                </p>
                <Link
                  to="/shop"
                  className="inline-block mt-2 px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="border border-zinc-200 p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                          Order ID
                        </span>
                        <p className="text-xs font-bold text-black">{ord.id}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                          Date
                        </span>
                        <p className="text-xs text-zinc-600">
                          {new Date(
                            ord.createdAt || Date.now(),
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                          Status
                        </span>
                        <span className="block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 text-center">
                          {ord.status || "Confirmed"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 uppercase font-semibold">
                          Total
                        </span>
                        <p className="text-xs font-black text-black">
                          {formatPrice(ord.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ord.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-3 text-xs"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt=""
                              className="w-10 h-12 object-cover bg-zinc-100"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-zinc-900 truncate uppercase">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-zinc-500">
                              Size: {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-bold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
