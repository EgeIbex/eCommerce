import Link from 'next/link';
import { productsAPI } from '@/lib/api';
import { Suspense } from 'react';

// Skeleton component for loading state
function ProductSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden animate-pulse border border-gray-200 dark:border-slate-700">
      <div className="aspect-w-16 aspect-h-9">
        <div className="w-full h-48 bg-gray-200 dark:bg-slate-700"></div>
      </div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
          <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

// Featured Products component with loading simulation
async function FeaturedProducts() {
  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const response = await productsAPI.getAll();
  const allProducts = response.data;
  const featuredProducts = allProducts.slice(0, 6);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredProducts.map((product) => (
        <div key={product.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-gray-200 dark:border-slate-700">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
              {product.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${product.price}
              </span>
              <Link
                href={`/products/${product.id}`}
                className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-300"
              >
                Detayları Gör
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 text-white py-20 transition-all duration-500 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              MobiVersite'ye Hoş Geldiniz
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              En kaliteli ürünleri en uygun fiyatlarla keşfedin. 
              Modern e-ticaret deneyiminin keyfini çıkarın.
            </p>
                    <div className="space-x-4">
                      <Link
                        href="/products"
                        className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        Ürünleri Keşfet
                      </Link>
                      <Link
                        href="/login"
                        className="border-2 border-white text-white hover:bg-white hover:text-blue-600 dark:border-slate-300 dark:hover:bg-slate-300 dark:hover:text-slate-800 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        Giriş Yap
                      </Link>
                    </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white dark:bg-slate-800 transition-colors duration-300 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Öne Çıkan Ürünler
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              En popüler ve en çok tercih edilen ürünlerimizi keşfedin
            </p>
          </div>

          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          }>
            <FeaturedProducts />
          </Suspense>

                  <div className="text-center mt-12">
                    <Link
                      href="/products"
                      className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Tüm Ürünleri Gör
                    </Link>
                  </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Neden MobiVersite?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600 dark:text-gray-300">Siparişleriniz 24 saat içinde kargoya verilir</p>
            </div>

            <div className="text-center bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Kalite Garantisi</h3>
              <p className="text-gray-600 dark:text-gray-300">Tüm ürünlerimiz kalite kontrolünden geçer</p>
            </div>

            <div className="text-center bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Müşteri Memnuniyeti</h3>
              <p className="text-gray-600 dark:text-gray-300">7/24 müşteri hizmetleri desteği</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}