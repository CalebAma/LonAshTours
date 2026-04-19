/**
 * LonAsh Tours Backend API
 *
 * Optional Paystack helpers for future online payments.
 * Booking storage previously used Firebase Firestore — removed; enable your own store when needed.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:8080', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Paystack Configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

/**
 * Verify Paystack Transaction
 * POST /api/verify-payment
 */
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { reference, bookingId } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Transaction reference is required'
      });
    }

    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Paystack secret key not configured'
      });
    }

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { data } = response.data;

    if (data.status === 'success') {
      /*
       * Firebase / Firestore — previously updated booking document here.
       * Payment integration temporarily disabled on the public site (Pay on Arrival).
       * Reconnect your database when bringing Paystack + persistence back online.
       *
       * Example (do not use without Firebase):
       * await db.collection('bookings').doc(bookingId).update({
       *   paymentStatus: 'Paid',
       *   status: 'Confirmed',
       *   paymentReference: reference,
       *   ...
       * });
       */
      if (bookingId) {
        console.log(`Payment verified for reference ${reference} (booking id hint: ${bookingId}) — no persistence layer configured.`);
      }

      return res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          reference: data.reference,
          amount: data.amount / 100,
          currency: data.currency,
          status: data.status,
          paid_at: data.paid_at,
          channel: data.channel,
          booking_updated: false
        }
      });
    }

    return res.json({
      success: false,
      message: `Payment verification failed: ${data.gateway_response || data.status}`,
      data: { status: data.status }
    });
  } catch (error) {
    console.error('Payment verification error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.response?.data?.message || error.message
    });
  }
});

/**
 * Initialize Paystack Payment
 * POST /api/initiate-payment
 */
app.post('/api/initiate-payment', async (req, res) => {
  try {
    const {
      email,
      amount,
      metadata = {},
      callback_url,
      mobile_money = true
    } = req.body;

    if (!email || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Email and amount are required'
      });
    }

    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Paystack secret key not configured'
      });
    }

    const channels = mobile_money ? ['card', 'mobile_money'] : ['card'];

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100),
        metadata,
        callback_url,
        channels
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { data } = response.data;

    return res.json({
      success: true,
      message: 'Payment initialized',
      data: {
        authorization_url: data.authorization_url,
        access_code: data.access_code,
        reference: data.reference
      }
    });
  } catch (error) {
    console.error('Payment initialization error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.response?.data?.message || error.message
    });
  }
});

/**
 * Paystack Webhook Handler
 * POST /api/webhook/paystack
 */
app.post('/api/webhook/paystack', async (req, res) => {
  try {
    const event = req.body;

    console.log('Paystack webhook received:', event.event);

    if (event.event === 'charge.success') {
      /*
       * Firebase / Firestore — previously updated bookings from webhook payload.
       * Payment integration temporarily disabled on the public site.
       */
      console.log('charge.success received — persistence disabled (no Firebase).');
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(200).json({ received: true, error: error.message });
  }
});

/**
 * Get Payment Status
 * GET /api/payment-status/:reference
 */
app.get('/api/payment-status/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Paystack secret key not configured'
      });
    }

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return res.json({
      success: true,
      data: response.data.data
    });
  } catch (error) {
    console.error('Get payment status error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: error.response?.data?.message || error.message
    });
  }
});

/**
 * Health Check
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    paystack_configured: !!PAYSTACK_SECRET_KEY
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║     LonAsh Tours API Server v1.0.0                    ║
║                                                        ║
╚════════════════════════════════════════════════════════╝

Server running on port: ${PORT}
Environment: ${process.env.NODE_ENV || 'development'}
Paystack: ${PAYSTACK_SECRET_KEY ? '✓ Configured' : '✗ Not configured'}
Firebase: removed (static site + Netlify Forms handle bookings)

Available endpoints:
  POST /api/verify-payment    - Verify Paystack transaction
  POST /api/initiate-payment  - Initialize new payment
  POST /api/webhook/paystack  - Paystack webhook handler
  GET  /api/payment-status/:ref - Get payment status
  GET  /api/health            - Health check
  `);
});

module.exports = app;
