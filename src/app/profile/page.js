'use client';

import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ordersAPI } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const { wishlist } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlistOpen, setIsWishlistOpen] = useState(true);
  const [isOrdersOpen, setIsOrdersOpen] = useState(true);
  const [openOrderIds, setOpenOrderIds] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderSuccess = searchParams.get('success') === 'order';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const loadOrders = async () => {
      try {
        const res = await ordersAPI.getByUser(user?.name);
        const data = Array.isArray(res.data) ? res.data : [];
        // Supabase kolon isimleri: created_at -> date için kullanacağız
        const mapped = data.map((o) => ({
          id: o.id,
          date: o.created_at ?? o.date,
          items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items || [],
          total: Number(o.total ?? 0),
          status: o.status || 'completed',
        }));
        setOrders(mapped);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, router, user?.name]);

  const toggleOrder = (orderId) => {
    setOpenOrderIds((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {orderSuccess && (
          <div className="mb-6 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-600 dark:text-green-300 px-4 py-3 rounded-md">
            Siparişiniz başarıyla oluşturuldu!
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Wishlist Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
            {/* Wishlist Header */}
            <div 
              className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
              onClick={() => setIsWishlistOpen(!isWishlistOpen)}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                İstek Listem ({wishlist.length} ürün)
              </h2>
              <svg 
                className={`w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isWishlistOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {/* Wishlist Content */}
            <div className={`transition-all duration-300 overflow-hidden ${isWishlistOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 pt-0">
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 dark:text-gray-400 text-6xl mb-4">❤️</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      İstek Listeniz Boş
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Beğendiğiniz ürünleri istek listenize ekleyerek daha sonra kolayca bulabilirsiniz.
                    </p>
                    <Link
                      href="/products"
                      className="inline-block bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 px-6 py-3 rounded-lg font-semibold transition duration-300"
                    >
                      Ürünleri Keşfet
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-200 dark:border-slate-700">
          {/* Order History Header */}
          <div 
            className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
            onClick={() => setIsOrdersOpen(!isOrdersOpen)}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sipariş Geçmişi
            </h2>
            <svg 
              className={`w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOrdersOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Order History Content */}
          <div className={`transition-all duration-300 overflow-hidden ${isOrdersOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-6 pt-0">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Siparişler yükleniyor...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400 text-4xl mb-4">📦</div>
                  <p className="text-gray-500 dark:text-gray-400">Henüz sipariş vermediniz.</p>
                  <Link
                    href="/products"
                    className="mt-4 inline-block bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-300"
                  >
                    Ürünleri Keşfet
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleOrder(order.id)}>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Sipariş #{order.id}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(order.date).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ${order.total.toFixed(2)}
                          </p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'completed' 
                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          }`}>
                            {order.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                          </span>
                          <div className={`mt-2 transition-transform ${openOrderIds[order.id] ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5 inline-block text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`space-y-2 transition-all duration-300 overflow-hidden ${openOrderIds[order.id] ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">
                              {item.title} x {item.quantity}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
