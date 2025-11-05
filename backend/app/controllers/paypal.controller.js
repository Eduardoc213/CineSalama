const paypalClient = require('../config/paypal.config');
const paypalSDK = require('@paypal/checkout-server-sdk');
const db = require('../models'); // Asegúrate de que la ruta sea correcta

// Crear orden de pago
exports.createOrder = async (req, res) => {
  try {
    const { reservaId, amount } = req.body;

    if (!reservaId || !amount) {
      return res.status(400).json({ message: 'reservaId y amount son requeridos' });
    }

    const request = new paypalSDK.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
          description: `Pago de reserva - Cine #${reservaId}`,
          reference_id: reservaId.toString(),
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/reservas?success=true`,
        cancel_url: `${process.env.FRONTEND_URL}/reservas?canceled=true`,
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
    const { orderID, reservaId } = req.body;

    if (!orderID || !reservaId) {
      return res.status(400).json({ message: 'orderID y reservaId son requeridos' });
    }

    const request = new paypalSDK.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const response = await paypalClient.execute(request);

    console.log('PayPal Response:', response.result.status);

    if (response.result.status === 'COMPLETED') {
      // Actualizar reserva a pagado
      const [updated] = await db.Reserva.update(
        { estado: 'pagado' },
        { where: { id: reservaId } }
      );

      console.log('Reserva actualizada:', updated);

      res.json({
        success: true,
        message: 'Pago procesado correctamente',
        orderId: orderID,
        updated: updated
      });
    } else {
      res.status(400).json({ message: 'Pago no completado', status: response.result.status });
    }
  } catch (error) {
    console.error('Error capturando pago:', error);
    res.status(500).json({ message: 'Error procesando pago', error: error.message });
  }
};