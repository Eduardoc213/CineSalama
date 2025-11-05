// app/config/paypal.config.js
const paypalSDK = require('@paypal/checkout-server-sdk');

const Environment = process.env.NODE_ENV === 'production' 
  ? paypalSDK.core.LiveEnvironment 
  : paypalSDK.core.SandboxEnvironment;

const client = new paypalSDK.core.PayPalHttpClient(
  new Environment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

module.exports = client;