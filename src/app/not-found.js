import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-300">
      <div className="text-center p-8">
        <div className="text-6xl font-bold text-gray-400 dark:text-slate-500 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Sayfa Bulunamadı
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 px-6 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/products"
            className="bg-gray-600 dark:bg-slate-700 text-white hover:bg-gray-700 dark:hover:bg-slate-600 px-6 py-3 rounded-lg font-medium transition-colors duration-300"
          >
            Ürünleri Gör
          </Link>
        </div>
      </div>
    </div>
  );
}
