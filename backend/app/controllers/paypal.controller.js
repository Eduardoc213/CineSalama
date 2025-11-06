const paypalClient = require('../config/paypal.config');
const paypalSDK = require('@paypal/checkout-server-sdk');
const db = require('../models');

// Crear orden de pago
exports.createOrder = async (req, res) => {
  try {
    const { reservaId, amount, type, cartItems } = req.body;

    // amount es siempre requerido
    if (!amount) {
      return res.status(400).json({ message: 'amount es requerido' });
    }

    // reservaId solo es requerido para reservas
    if (type === 'reserva' && !reservaId) {
      return res.status(400).json({ message: 'reservaId es requerido para reservas' });
    }

    const request = new paypalSDK.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    
    const description = type === 'reserva' 
      ? `Pago de reserva - Cine #${reservaId}`
      : 'Pago de compra - Snacks';

    const returnUrl = type === 'reserva'
      ? `${process.env.FRONTEND_URL}/reservas?success=true`
      : `${process.env.FRONTEND_URL}/checkout?success=true`;

    const cancelUrl = type === 'reserva'
      ? `${process.env.FRONTEND_URL}/reservas?canceled=true`
      : `${process.env.FRONTEND_URL}/checkout?canceled=true`;

    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
          description: description,
          reference_id: reservaId ? reservaId.toString() : 'checkout',
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
        brand_name: 'CineSalama',
        user_action: 'PAY_NOW',
      },
    });

    const response = await paypalClient.execute(request);
    res.json({
      id: response.result.id,
    });
  } catch (error) {
    console.error('Error creando orden PayPal:', error);
    res.status(500).json({ message: 'Error creando orden de pago', error: error.message });
  }
};

// Capturar pago
exports.captureOrder = async (req, res) => {
  try {
    const { orderID, reservaId, type, cartItems } = req.body;

    if (!orderID) {
      return res.status(400).json({ message: 'orderID es requerido' });
    }

    // reservaId solo es requerido para reservas
    if (type === 'reserva' && !reservaId) {
      return res.status(400).json({ message: 'reservaId es requerido para reservas' });
    }

    const request = new paypalSDK.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const response = await paypalClient.execute(request);

    console.log('PayPal Response Status:', response.result.status);
    console.log('Tipo de pago:', type);
    console.log('Reserva ID:', reservaId);

    if (response.result.status === 'COMPLETED') {
      // Solo actualizar reserva si es tipo reserva
      if (type === 'reserva' && reservaId) {
        const [updated] = await db.Reserva.update(
          { estado: 'pagado' },
          { where: { id: reservaId } }
        );
        console.log('Reserva actualizada:', updated);
        
        if (updated === 0) {
          console.warn('No se encontró la reserva con ID:', reservaId);
        }
      }

      res.json({
        success: true,
        message: 'Pago procesado correctamente',
        orderId: orderID,
        type: type,
        reservaId: reservaId
      });
    } else {
      res.status(400).json({ 
        message: 'Pago no completado', 
        status: response.result.status 
      });
    }
  } catch (error) {
    console.error('Error capturando pago:', error);
    res.status(500).json({ 
      message: 'Error procesando pago', 
      error: error.message 
    });
  }
};