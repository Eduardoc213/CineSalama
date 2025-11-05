// app/components/CartIcon.js
'use client';

import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function CartIcon() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Link href="/cart" className="relative">
      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <span className="text-xl">🛒</span>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
    </Link>
  );
}