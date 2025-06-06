
'use client';

import type { Product, CartItem } from '@/types';
import React, { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, productTitle: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotalItems: () => number;
  getCartUniqueItemsCount: () => number;
  isCartEmpty: () => boolean;
  loadSharedCart: (items: CartItem[]) => void;
  rawCartItems: CartItem[]; // Expose raw items for sharing logic
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'app-cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage", error);
      }
    }
  }, [cartItems, isMounted]);

  const addToCart = useCallback((productId: string, productTitle: string, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { productId, quantity }];
    });
    toast({
      title: t('itemAddedToCart'),
      description: `${productTitle} ${t('itemAddedToCartDescSuffix')}`,
    });
  }, [t, toast]);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    toast({
      title: t('itemRemovedFromCart'),
      variant: 'destructive',
    });
  }, [t, toast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast({
      title: t('cartCleared'),
    });
  }, [t, toast]);

  const getCartTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getCartUniqueItemsCount = useCallback(() => {
    return cartItems.length;
  }, [cartItems]);

  const isCartEmpty = useCallback(() => {
    return cartItems.length === 0;
  }, [cartItems]);

  const loadSharedCart = useCallback((items: CartItem[]) => {
    setCartItems(items);
     toast({
      title: t('sharedCartLoadedTitle'),
      description: t('sharedCartLoadedDesc'),
    });
  }, [t, toast]);


  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotalItems,
    getCartUniqueItemsCount,
    isCartEmpty,
    loadSharedCart,
    rawCartItems: cartItems, // For sharing logic
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotalItems, getCartUniqueItemsCount, isCartEmpty, loadSharedCart]);


  if (!isMounted) {
    return null; // Or a loading spinner, to prevent hydration mismatch with localStorage
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
