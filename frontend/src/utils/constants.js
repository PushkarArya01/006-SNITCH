export const NAV_LINKS = [
  { name: 'NEW ARRIVALS', path: '/shop?filter=new' },
  { name: 'BEST SELLERS', path: '/shop?filter=bestseller' },
  { name: 'SHIRTS', path: '/shop?category=shirts' },
  { name: 'T-SHIRTS', path: '/shop?category=t-shirts' },
  { name: 'BOTTOMS', path: '/shop?category=bottoms' },
  { name: 'OVERSIZED', path: '/shop?category=oversized' },
  { name: 'SNITCH LUXE', path: '/shop?category=luxe' },
];

export const CATEGORIES = [
  {
    id: 'shirts',
    name: 'SHIRTS',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
    tagline: 'Casual & Formal essentials',
  },
  {
    id: 't-shirts',
    name: 'T-SHIRTS',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    tagline: 'Graphic & Heavyweight Tees',
  },
  {
    id: 'bottoms',
    name: 'JEANS & CARGOS',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800&auto=format&fit=crop',
    tagline: 'Relaxed & Straight fits',
  },
  {
    id: 'oversized',
    name: 'OVERSIZED DROPS',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop',
    tagline: 'Streetwear tailored for you',
  },
  {
    id: 'co-ords',
    name: 'CO-ORD SETS',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    tagline: 'Effortless coordinated sets',
  },
  {
    id: 'perfumes',
    name: 'FRAGRANCES',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop',
    tagline: 'Signature luxury scents',
  },
];

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const AVAILABLE_COUPONS = [
  { code: 'SNITCH10', discount: 10, minSpend: 999, description: '10% off on orders above ₹999' },
  { code: 'FLAT200', discountAmount: 200, minSpend: 1499, description: 'Flat ₹200 off on first order above ₹1,499' },
  { code: 'COHORT3', discount: 15, minSpend: 1999, description: '15% special developer cohort discount' },
];

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 99;
