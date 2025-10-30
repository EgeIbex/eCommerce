'use client';

import Link from 'next/link';
import { productsAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

// Skeleton component for loading state
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200"></div>
        <div className="absolute top-2 right-2 p-2 bg-white rounded-full">
          <div className="w-5 h-5 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Products component with search and category filtering
function ProductsList({ selectedCategory, searchTerm, allProducts, isLoading }) {
  // Filter products by search term and category
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    return filtered;
  }, [allProducts, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {searchTerm ? 'Arama Sonucu Bulunamadı' : 'Ürün Bulunamadı'}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {searchTerm 
            ? `"${searchTerm}" için arama sonucu bulunamadı. Farklı anahtar kelimeler deneyin.`
            : 'Bu kategoride henüz ürün bulunmamaktadır.'
          }
        </p>
        {searchTerm && (
          <button
            onClick={() => window.location.reload()}
            className="inline-block bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 px-6 py-3 rounded-lg font-semibold transition duration-300"
          >
            Aramayı Temizle
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function ProductsPage({ searchParams }) {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // useDebounce ile search term'i optimize et (500ms gecikme)
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // URL search params'ı işle
  useEffect(() => {
    const processSearchParams = async () => {
      const resolvedSearchParams = await searchParams;
      if (resolvedSearchParams?.category) {
        setSelectedCategory(resolvedSearchParams.category);
      }
    };
    processSearchParams();
  }, [searchParams]);

  // Ürünleri yükle
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await productsAPI.getAll();
        setAllProducts(response.data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Get unique categories
  const categories = useMemo(() => [
    { name: 'Tümü', value: 'all' },
    ...Array.from(new Set(allProducts.map(product => product.category))).map(category => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: category
    }))
  ], [allProducts]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                Searching for "{searchTerm}"
              </p>
            )}
          </div>
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 dark:bg-blue-700 text-white'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <ProductsList 
          selectedCategory={selectedCategory} 
          searchTerm={debouncedSearchTerm}
          allProducts={allProducts}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
