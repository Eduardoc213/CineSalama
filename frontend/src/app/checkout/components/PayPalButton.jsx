'use client';
import React, { useEffect, useState, useRef } from 'react';
import { createPayPalOrder, capturePayPalOrder } from '../../services/api';

export default function PayPalButton({ cartItems, amount, onSuccess, onError }) {
  const [loaded, setLoaded] = useState(false);
  const scriptLoaded = useRef(false);
  const buttonsRendered = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
      console.error('NEXT_PUBLIC_PAYPAL_CLIENT_ID no está configurado');
      onError?.('Client ID no configurado');
      return;
    }

    if (document.querySelector('script[src*="paypal.com/sdk/js"]')) {
      setLoaded(true);
      setTimeout(initPayPal, 100);
      return;
    }

    scriptLoaded.current = true;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      setLoaded(true);
      setTimeout(initPayPal, 100);
    };
    script.onerror = () => {
      console.error('Error cargando script de PayPal');
      scriptLoaded.current = false;
      onError?.('Error cargando PayPal');
    };
    document.body.appendChild(script);
  }, []);

  const initPayPal = () => {
    if (buttonsRendered.current) return;

    const container = document.getElementById('paypal-button-container-checkout');
    if (!container || !window.paypal) {
      console.error('Contenedor PayPal no encontrado');
      return;
    }

    buttonsRendered.current = true;

    window.paypal.Buttons({
      createOrder: async () => {
        try {
          const response = await createPayPalOrder({
            cartItems,
            amount,
            type: 'checkout',
          });
          return response.id;
        } catch (error) {
          console.error('Error creando orden:', error);
          throw error;
        }
      },
      onApprove: async (data) => {
        try {
          const response = await capturePayPalOrder({
            orderID: data.orderID,
            cartItems,
          });
          buttonsRendered.current = false;
          onSuccess?.(response);
        } catch (error) {
          console.error('Error capturando pago:', error);
          throw error;
        }
      },
      onError: (err) => {
        console.error('Error PayPal:', err);
        onError?.(err);
      },
    }).render('#paypal-button-container-checkout');
  };

  return <div id="paypal-button-container-checkout"></div>;
}