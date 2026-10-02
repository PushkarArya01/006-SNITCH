import React, { useState, useEffect } from 'react';

const MESSAGES = [
  '⚡ FREE SHIPPING ON ALL PREPAID ORDERS ABOVE ₹999',
  '🔥 FLAT ₹200 OFF ON FIRST PURCHASE | USE CODE: FLAT200',
  '✨ NEW SEASON COLLECTION DROPPED — EXPLORE THE EDIT',
  '📦 EASY 7 DAYS HASSLE-FREE EXCHANGE & RETURN',
];

const TopBanner = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white text-[11px] font-medium tracking-widest py-2 px-4 text-center transition-all duration-500 overflow-hidden uppercase select-none">
      <div className="flex items-center justify-center space-x-2 animate-fade-in">
        <span>{MESSAGES[index]}</span>
      </div>
    </div>
  );
};

export default TopBanner;
