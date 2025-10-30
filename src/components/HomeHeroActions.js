'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function HomeHeroActions() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-x-4">
      <Link
        href="/products"
        className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        Ürünleri Keşfet
      </Link>
      {!isAuthenticated && (
        <Link
          href="/login"
          className="border-2 border-white text-white hover:bg-white hover:text-blue-600 dark:border-slate-300 dark:hover:bg-slate-300 dark:hover:text-slate-800 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Giriş Yap
        </Link>
      )}
    </div>
  );
}


