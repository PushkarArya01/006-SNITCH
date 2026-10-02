import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Truck, CreditCard, Smartphone, Banknote, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { formatPrice } from '../utils/formatCurrency';

const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI (Google Pay, PhonePe, Paytm)', icon: Smartphone },
  { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
  { id: 'cod', name: 'Cash on Delivery (+ ₹49 convenience fee)', icon: Banknote },
];

const CheckoutPage = () => {
  const { cartItems, subtotal, discountAmount, shippingFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (cartItems.length === 0 && !completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold uppercase tracking-wider">Your Bag is Empty</h2>
        <p className="text-xs text-zinc-500">Add some styles to your bag before checking out.</p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-zinc-800"
        >
          Go Shopping
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          size: item.size,
          quantity: item.quantity,
          image: item.product.images?.[0],
        })),
        shippingAddress: address,
        paymentMethod,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount: paymentMethod === 'cod' ? totalAmount + 49 : totalAmount,
      };

      const res = await orderApi.createOrder(orderPayload);
      setCompletedOrder(res.order);
      clearCart();
    } catch (err) {
      alert('Error placing order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Confirmed State
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-900">
          Order Successfully Placed!
        </h1>
        <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
          Order ID: <span className="font-bold text-black">{completedOrder.id}</span>
        </p>

        <div className="mt-8 bg-zinc-50 border border-zinc-200 p-6 text-left space-y-4">
          <div className="border-b border-zinc-200 pb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">Delivery Details</h3>
            <p className="text-xs text-zinc-700 mt-1 font-semibold">{address.fullName} ({address.phone})</p>
            <p className="text-xs text-zinc-500">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-2">Items Ordered</h3>
            <div className="space-y-2">
              {completedOrder.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="font-medium text-zinc-800">
                    {it.name} <span className="text-zinc-500">({it.size}) × {it.quantity}</span>
                  </span>
                  <span className="font-bold text-black">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-3 flex justify-between font-bold text-sm">
            <span>Total Paid</span>
            <span>{formatPrice(completedOrder.totalAmount)}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/shop"
            className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800"
          >
            Continue Shopping
          </Link>
          <Link
            to="/account"
            className="px-8 py-3 bg-zinc-100 text-black border border-zinc-300 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200"
          >
            View In My Orders
          </Link>
        </div>
      </div>
    );
  }

  const finalTotal = paymentMethod === 'cod' ? totalAmount + 49 : totalAmount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Link
        to="/shop"
        className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Shipping Address & Payment Form (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Step 1: Delivery Address */}
            <div className="border border-zinc-200 p-6 bg-white shadow-sm">
              <div className="flex items-center space-x-2 border-b border-zinc-200 pb-3 mb-4">
                <Truck className="w-4 h-4 text-black" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-black">
                  1. Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={address.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 text-xs border border-zinc-300 focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs border border-zinc-300 focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    name="pincode"
                    value={address.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g. 560001"
                    className="w-full px-3 py-2 text-xs border border-zinc-300 focus:border-black outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Street Address / Flat / Building *
                  </label>
                  <input
                    type="text"
                    required
                    name="street"
                    value={address.street}
                    onChange={handleInputChange}
                    placeholder="House / Flat No., Road, Landmark"
                    className="w-full px-3 py-2 text-xs border border-zinc-300 focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={address.city}
                    onChange={handleInputChange}
                    placeholder="Bengaluru / Mumbai / Delhi"
                    className="w-full px-3 py-2 text-xs border border-zinc-300 focus:border-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={address.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full px-3 py-2 text-xs border border-zinc-300 focus:border-black outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Options */}
            <div className="border border-zinc-200 p-6 bg-white shadow-sm">
              <div className="flex items-center space-x-2 border-b border-zinc-200 pb-3 mb-4">
                <CreditCard className="w-4 h-4 text-black" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-black">
                  2. Select Payment Mode
                </h2>
              </div>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <label
                      key={pm.id}
                      className={`flex items-center justify-between p-3.5 border cursor-pointer transition ${
                        paymentMethod === pm.id
                          ? 'border-black bg-zinc-50'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pm.id}
                          checked={paymentMethod === pm.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="accent-black"
                        />
                        <span className="text-xs font-bold text-zinc-900">{pm.name}</span>
                      </div>
                      <Icon className="w-4 h-4 text-zinc-600" />
                    </label>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming Order...' : `Complete Order • ${formatPrice(finalTotal)}`}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Breakdown (5 cols) */}
        <div className="lg:col-span-5">
          <div className="border border-zinc-200 bg-zinc-50 p-6 sticky top-28 space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b border-zinc-200 pb-3">
              Order Summary ({cartItems.length} items)
            </h2>

            {/* Items list */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex space-x-3 text-xs">
                  <img
                    src={item.product.images?.[0]}
                    alt=""
                    className="w-14 h-18 object-cover bg-zinc-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-zinc-900 truncate uppercase">{item.product.name}</p>
                    <p className="text-zinc-500 text-[11px]">Size: {item.size} | Qty: {item.quantity}</p>
                    <p className="font-bold text-black mt-1">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-zinc-200 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-semibold text-black">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span className="text-emerald-600 font-semibold">FREE</span> : formatPrice(shippingFee)}</span>
              </div>
              {paymentMethod === 'cod' && (
                <div className="flex justify-between text-zinc-600">
                  <span>COD Convenience Fee</span>
                  <span>{formatPrice(49)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-black pt-3 border-t border-zinc-200">
                <span>Grand Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-zinc-500 pt-2 border-t border-zinc-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>SSL Encrypted Checkout. Your details are safe with us.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
