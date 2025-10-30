'use client';

import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';
import { cartAPI, productsAPI } from '@/lib/api';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.payload);
    
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    
    case 'CLEAR_CART':
      return [];
    
    case 'LOAD_CART':
      return action.payload || [];
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const { user, isAuthenticated } = useAuth();
  const prevAuthRef = useRef(isAuthenticated);

  // Misafir kullanıcı için localStorage'dan yükle
  useEffect(() => {
    if (isAuthenticated) return; // loginliyse misafir verisini yükleme
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      }
    } catch {}
  }, [isAuthenticated]);

  // Logout geçişinde hem state'i hem localStorage'ı temizle
  useEffect(() => {
    if (prevAuthRef.current && !isAuthenticated) {
      try { localStorage.removeItem('cart'); } catch {}
      dispatch({ type: 'CLEAR_CART' });
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // Auth olmuş kullanıcı için Supabase'den sepeti yükle
  useEffect(() => {
    const loadFromSupabase = async () => {
      if (!isAuthenticated || !user?.name) return;
      try {
        // 1) Misafir sepetini Supabase'e taşı (merge)
        const guestSaved = localStorage.getItem('cart');
        if (guestSaved) {
          try {
            const guestItems = JSON.parse(guestSaved) || [];
            const { data: existing } = await cartAPI.getByUser(user.name);
            for (const gi of guestItems) {
              const row = (existing || []).find((e) => e.product_id === gi.id);
              const newQty = (row?.quantity ?? 0) + (gi.quantity ?? 1);
              if (row) {
                await cartAPI.updateQuantity(user.name, gi.id, newQty);
              } else {
                await cartAPI.add({ user_name: user.name, product_id: gi.id, quantity: gi.quantity ?? 1 });
              }
            }
            localStorage.removeItem('cart');
          } catch (e) {
            console.error('Misafir sepetini taşıma hatası:', e);
          }
        }

        // 2) Supabase'den güncel veriyi çek
        const { data: entries } = await cartAPI.getByUser(user.name);
        const productIds = entries.map((e) => e.product_id);
        const prodsRes = await productsAPI.getManyByIds(productIds);
        const prods = prodsRes.data || [];
        const merged = entries.map((e) => {
          const p = prods.find((pp) => pp.id === e.product_id) || {};
          return {
            id: p.id,
            title: p.title,
            price: p.price,
            image: p.image,
            quantity: e.quantity ?? 1,
          };
        });
        dispatch({ type: 'LOAD_CART', payload: merged });
      } catch (err) {
        console.error('Supabase sepet yükleme hatası:', err);
      }
    };
    loadFromSupabase();
  }, [isAuthenticated, user?.name]);

  // Sadece misafir için localStorage'a yaz
  useEffect(() => {
    if (isAuthenticated) return; // loginliyse localStorage'ı kullanma
    try { localStorage.setItem('cart', JSON.stringify(cart)); } catch {}
  }, [cart, isAuthenticated]);

  const addToCart = useCallback(async (product) => {
    if (isAuthenticated && user?.name) {
      try {
        // Eğer kayıt varsa quantity +1, yoksa ekle
        const { data: existing } = await cartAPI.getByUser(user.name);
        const row = (existing || []).find((e) => e.product_id === product.id);
        if (row) {
          await cartAPI.updateQuantity(user.name, product.id, (row.quantity ?? 1) + 1);
        } else {
          await cartAPI.add({ user_name: user.name, product_id: product.id, quantity: 1 });
        }
      } catch (e) {
        console.error('Supabase addToCart hatası:', e);
      }
    }
    dispatch({ type: 'ADD_TO_CART', payload: product });
  }, [isAuthenticated, user?.name]);

  const removeFromCart = useCallback(async (productId) => {
    if (isAuthenticated && user?.name) {
      try { await cartAPI.remove(user.name, productId); } catch (e) { console.error('Supabase removeFromCart hatası:', e); }
    }
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  }, [isAuthenticated, user?.name]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      if (isAuthenticated && user?.name) {
        try { await cartAPI.updateQuantity(user.name, productId, quantity); } catch (e) { console.error('Supabase updateQuantity hatası:', e); }
      }
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    }
  }, [removeFromCart, isAuthenticated, user?.name]); 

  const clearCart = useCallback(() => {
    // Not: İstenirse Supabase tarafında toplu silme eklenebilir
    dispatch({ type: 'CLEAR_CART' });
  }, []); 

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
