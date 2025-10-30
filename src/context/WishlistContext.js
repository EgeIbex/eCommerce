'use client';

import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { wishlistAPI, productsAPI } from '@/lib/api';

const WishlistContext = createContext();

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_WISHLIST':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state;
      }
      return [...state, action.payload];
    
    case 'REMOVE_FROM_WISHLIST':
      return state.filter(item => item.id !== action.payload);
    
    case 'CLEAR_WISHLIST':
      return [];
    
    case 'LOAD_WISHLIST':
      return action.payload || [];
    
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, dispatch] = useReducer(wishlistReducer, []);
  const { user, isAuthenticated } = useAuth();
  const prevAuthRef = useRef(isAuthenticated);

  // Misafir için localStorage'dan yükle
  useEffect(() => {
    if (isAuthenticated) return;
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) });
      }
    } catch {}
  }, [isAuthenticated]);

  // Sadece misafir için localStorage'a yaz
  useEffect(() => {
    if (isAuthenticated) return;
    try { localStorage.setItem('wishlist', JSON.stringify(wishlist)); } catch {}
  }, [wishlist, isAuthenticated]);

  // Logout geçişinde hem state'i hem localStorage'ı temizle
  useEffect(() => {
    if (prevAuthRef.current && !isAuthenticated) {
      try { localStorage.removeItem('wishlist'); } catch {}
      dispatch({ type: 'CLEAR_WISHLIST' });
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // Auth'lu kullanıcı için Supabase'den yükle
  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!isAuthenticated || !user?.name) return;
      try {
        // 1) Misafir wishlist'ini Supabase'e taşı (merge)
        const guestSaved = localStorage.getItem('wishlist');
        if (guestSaved) {
          try {
            const guestItems = JSON.parse(guestSaved) || [];
            const { data: rowsExist } = await wishlistAPI.getByUser(user.name);
            const existingIds = new Set((rowsExist || []).map((r) => r.product_id));
            for (const gi of guestItems) {
              if (!existingIds.has(gi.id)) {
                await wishlistAPI.add({ user_name: user.name, product_id: gi.id });
              }
            }
            localStorage.removeItem('wishlist');
          } catch (e) {
            console.error('Misafir wishlist taşıma hatası:', e);
          }
        }

        // 2) Supabase'den güncel veriyi çek
        const { data: rows } = await wishlistAPI.getByUser(user.name);
        const ids = (rows || []).map((r) => r.product_id);
        const res = await productsAPI.getManyByIds(ids);
        const products = res.data || [];
        dispatch({ type: 'LOAD_WISHLIST', payload: products });
      } catch (e) {
        console.error('Supabase wishlist yükleme hatası:', e);
      }
    };
    loadFromSupabase();
  }, [isAuthenticated, user?.name]);

  const addToWishlist = useCallback(async (product) => {
    if (isAuthenticated && user?.name) {
      try { await wishlistAPI.add({ user_name: user.name, product_id: product.id }); } catch (e) { console.error('Supabase addToWishlist hatası:', e); }
    }
    dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
  }, [isAuthenticated, user?.name]);

  const removeFromWishlist = useCallback(async (productId) => {
    if (isAuthenticated && user?.name) {
      try { await wishlistAPI.remove(user.name, productId); } catch (e) { console.error('Supabase removeFromWishlist hatası:', e); }
    }
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  }, [isAuthenticated, user?.name]);

  const clearWishlist = useCallback(() => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  }, []);

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
