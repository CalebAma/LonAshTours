/**
 * LonAsh Tours Backend API
 * 
 * Features:
 * - Paystack payment verification
 * - Webhook handling for payment status updates
 * - Firebase Firestore integration for booking management
 * - CORS enabled for frontend integration
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');
const path = require('path');

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

// Initialize Firebase Admin
let db;
try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json';
  const serviceAccount = require(path.resolve(serviceAccountPath));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  db = admin.firestore();
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.warn('Firebase Admin not initialized - using mock mode for development');
  console.warn('Error:', error.message);
  // Mock db for development
  db = {
    collection: () => ({
      doc: () => ({
        update: async () => ({ success: true }),
        get: async () => ({ exists: true, data: () => ({}) })
      }),
      add: async () => ({ id: 'mock-id' }),
      where: () => ({
        get: async () => ({ docs: [], empty: true })
      })
    })
  };
}

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

    // Verify transaction with Paystack
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
      // Payment successful - update booking in Firestore
      const updateData = {
        paymentStatus: 'Paid',
        status: 'Confirmed',
        paymentReference: reference,
        paymentVerifiedAt: new Date().toISOString(),
        paymentAmount: data.amount / 100, // Convert from pesewas to GHS
        paymentChannel: data.channel,
        paidAt: data.paid_at,
        currency: data.currency
      };

      // Update booking if bookingId provided
      if (bookingId && db) {
        try {
          await db.collection('bookings').doc(bookingId).update(updateData);
          console.log(`Booking ${bookingId} updated with payment confirmation`);
        } catch (dbError) {
          console.error('Error updating booking:', dbError);
        }
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
          booking_updated: !!bookingId
        }
      });
    } else {
      return res.json({
        success: false,
        message: `Payment verification failed: ${data.gateway_response || data.status}`,
        data: { status: data.status }
      });
    }
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
      mobile_money = true // Enable mobile money
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

    // Add mobile money channels
    const channels = ['card', 'mobile_money'];

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100), // Convert to pesewas
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

    // Handle charge.success event
    if (event.event === 'charge.success') {
      const { data } = event;
      
      // Extract booking ID from metadata if available
      const bookingId = data.metadata?.booking_id;
      
      const updateData = {
        paymentStatus: 'Paid',
        status: 'Confirmed',
        paymentReference: data.reference,
        paymentVerifiedAt: new Date().toISOString(),
        paymentAmount: data.amount / 100,
        paymentChannel: data.channel,
        paidAt: data.paid_at,
        currency: data.currency,
        gateway_response: data.gateway_response
      };

      // Update booking in Firestore
      if (bookingId && db) {
        try {
          await db.collection('bookings').doc(bookingId).update(updateData);
          console.log(`Booking ${bookingId} updated via webhook`);
        } catch (dbError) {
          console.error('Error updating booking via webhook:', dbError);
        }
      }

      // Also update by reference if no booking_id in metadata
      try {
        const bookingsRef = db.collection('bookings');
        const snapshot = await bookingsRef
          .where('paymentReference', '==', data.reference)
          .get();
        
        if (!snapshot.empty) {
          snapshot.forEach(async (doc) => {
            await doc.ref.update(updateData);
            console.log(`Booking ${doc.id} updated via webhook (reference match)`);
          });
        }
      } catch (searchError) {
        console.error('Error searching for booking by reference:', searchError);
      }
    }

    // Return 200 to acknowledge receipt
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to prevent Paystack from retrying
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
    paystack_configured: !!PAYSTACK_SECRET_KEY,
    firebase_configured: !!db
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
Firebase: ${db ? '✓ Connected' : '✗ Not connected'}

Available endpoints:
  POST /api/verify-payment    - Verify Paystack transaction
  POST /api/initiate-payment  - Initialize new payment
  POST /api/webhook/paystack  - Paystack webhook handler
  GET  /api/payment-status/:ref - Get payment status
  GET  /api/health            - Health check
  `);
});

module.exports = app;
