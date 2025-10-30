'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      addToCart(product);
    } finally {
      setTimeout(() => setIsAdding(false), 1000); // 1 saniye "Ekleniyor..."
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 group border border-gray-200 dark:border-slate-700">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
          />
        </Link>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full transition duration-300 ${
            isInWishlist(product.id)
              ? 'bg-red-500 text-white'
              : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition duration-300">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-2 px-4 rounded-lg font-medium transition duration-300 ${
              isAdding
                ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed animate-pulse'
                : 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800'
            }`}
          >
            {isAdding ? 'Ekleniyor...' : 'Sepete Ekle'}
          </button>
          
          <Link
            href={`/products/${product.id}`}
            className="block w-full py-2 px-4 text-center border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg font-medium transition duration-300"
          >
            Detayları Gör
          </Link>
        </div>
      </div>
    </div>
  );
}
