// app/context/CartContext.js
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cineha-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cineha-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, type) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => 
        cartItem.id === item.id && cartItem.type === type
      );

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id && cartItem.type === type
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Para promociones, calcular el precio con descuento
        let finalPrice = item.precio || 0;
        if (type === 'promo' && item.descuento) {
          finalPrice = item.precio * (1 - item.descuento / 100);
        }
        
        return [...prevCart, { 
          ...item, 
          type, 
          quantity: 1,
          price: finalPrice,
          precio_original: item.precio || 0, // Guardar precio original para mostrar
          descuento: item.descuento || 0 // Guardar descuento para mostrar
        }];
      }
    });
  };

  const removeFromCart = (id, type) => {
    setCart(prevCart => prevCart.filter(item => 
      !(item.id === id && item.type === type)
    ));
  };

  const updateQuantity = (id, type, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, type);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.type === type
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemQuantity = (id, type) => {
    const item = cart.find(item => item.id === id && item.type === type);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getTotalItems,
      getItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};