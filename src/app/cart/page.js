'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CartItem from '@/components/CartItem';
import { ordersAPI, cartAPI } from '@/lib/api';

export default function CartPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }

    if (cart.length === 0) return;

    setIsCheckingOut(true);
    try {
      // Sipariş nesnesi
      const orderPayload = {
        user_name: user?.name,
        items: cart,
        total: Number(getTotalPrice().toFixed(2)),
        status: 'completed',
      };

      await ordersAPI.create(orderPayload);

      // Supabase cart temizliği (server-side) ve UI state temizliği
      try { if (orderPayload.user_name) await cartAPI.clearAll(orderPayload.user_name); } catch {}
      clearCart();

      router.push('/profile?success=order');
    } catch (e) {
      console.error('Checkout hata:', e);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Sepetiniz Boş
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Henüz sepetinize ürün eklemediniz. Ürünlerimizi keşfetmek için aşağıdaki butona tıklayın.
            </p>
            <button
              onClick={() => router.push('/products')}
              className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
            >
              Ürünleri Keşfet
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-4 sm:py-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8">
          Sepetim ({cart.length} ürün)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Order Summary - Mobile First */}
          <div className="lg:col-span-1 lg:order-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 sm:p-6 sticky top-4 sm:top-8 border border-gray-200 dark:border-slate-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Sipariş Özeti
              </h2>
              
              <div className="space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Ara Toplam</span>
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Kargo</span>
                  <span className="text-sm sm:text-base font-medium text-green-600 dark:text-green-400">Ücretsiz</span>
                </div>
                <div className="border-t border-gray-200 dark:border-slate-600 pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    <span>Toplam</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full py-3 px-4 sm:px-6 rounded-lg font-medium transition duration-300 text-sm sm:text-base ${
                  isCheckingOut
                    ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
                    : 'bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-800'
                }`}
              >
                {isCheckingOut ? 'Sipariş Veriliyor...' : 'Siparişi Tamamla'}
              </button>

              {!isAuthenticated && (
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                  Sipariş vermek için giriş yapmanız gerekmektedir.
                </p>
              )}
            </div>
          </div>

          {/* Cart Items */}
          <div className="lg:col-span-2 lg:order-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-slate-700">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
