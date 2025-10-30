'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="p-3 sm:p-6 border-b border-gray-200 dark:border-slate-700 last:border-b-0">
      <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Link href={`/products/${item.id}`}>
            <img
              src={item.image}
              alt={item.title}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg hover:opacity-80 transition duration-300"
            />
          </Link>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/products/${item.id}`}>
            <h3 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition duration-300 line-clamp-2 sm:line-clamp-1">
              {item.title}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            ${item.price} / adet
          </p>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="flex flex-col sm:hidden items-end space-y-2">
          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-7 h-7 rounded-full border border-gray-300 dark:border-slate-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm"
            >
              -
            </button>
            <span className="w-8 text-center font-medium text-gray-900 dark:text-white text-sm">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-7 h-7 rounded-full border border-gray-300 dark:border-slate-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm"
            >
              +
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
            title="Ürünü Kaldır"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Desktop Layout - Horizontal */}
        <div className="hidden sm:flex items-center space-x-2">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-slate-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
            >
              -
            </button>
            <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-slate-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300"
            >
              +
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2"
            title="Ürünü Kaldır"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const areEqual = (prevProps, nextProps) => {
  const prevItem = prevProps.item;
  const nextItem = nextProps.item;
  
  return (
    prevItem.id === nextItem.id &&
    prevItem.title === nextItem.title &&
    prevItem.price === nextItem.price &&
    prevItem.image === nextItem.image &&
    prevItem.quantity === nextItem.quantity
  );
};

export default React.memo(CartItem, areEqual);
