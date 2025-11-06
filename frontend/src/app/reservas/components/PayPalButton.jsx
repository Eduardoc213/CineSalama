'use client';
import React, { useEffect, useState, useRef } from 'react';
import { createPayPalOrder, capturePayPalOrder } from '../../services/api'; // Ruta corregida

export default function PayPalButton({ reservaId, amount, onSuccess, onError }) {
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

    // Verificar si el script ya existe
    if (document.querySelector('script[src*="paypal.com/sdk/js"]')) {
      setLoaded(true);
      setTimeout(initPayPal, 100);
      return;
    }

    scriptLoaded.current = true;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
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

    return () => {
      // Cleanup si es necesario
    };
  }, []);

  const initPayPal = () => {
    if (buttonsRendered.current) return;

    const container = document.getElementById(`paypal-button-container-${reservaId}`);
    if (!container) {
      console.error('Contenedor PayPal no encontrado');
      return;
    }

    if (!window.paypal) {
      console.error('PayPal no está disponible');
      return;
    }

    buttonsRendered.current = true;

    window.paypal.Buttons({
      createOrder: async (data, actions) => {
        try {
          console.log('Creando orden PayPal para reserva:', reservaId, 'Monto:', amount);
          const response = await createPayPalOrder({
            reservaId: reservaId,
            amount: amount,
            type: 'reserva'
          });
          console.log('Orden creada con ID:', response.id);
          return response.id;
        } catch (error) {
          console.error('Error creando orden PayPal:', error);
          onError?.(error.message || 'Error creando orden de pago');
          throw error;
        }
      },
      onApprove: async (data, actions) => {
        try {
          console.log('Capturando pago PayPal, orderID:', data.orderID);
          const response = await capturePayPalOrder({
            orderID: data.orderID,
            reservaId: reservaId,
            type: 'reserva'
          });
          console.log('Pago capturado exitosamente:', response);
          onSuccess?.(response);
        } catch (error) {
          console.error('Error capturando pago PayPal:', error);
          onError?.(error.message || 'Error procesando pago');
          throw error;
        }
      },
      onError: (err) => {
        console.error('Error en botón PayPal:', err);
        onError?.(err.toString());
      },
      onCancel: (data) => {
        console.log('Pago cancelado por el usuario:', data);
        onError?.('Pago cancelado');
      }
    }).render(`#paypal-button-container-${reservaId}`);
  };

  return <div id={`paypal-button-container-${reservaId}`}></div>;
}