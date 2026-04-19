/**
 * LonAsh Tours - Configuration
 * 
 * IMPORTANT: These are PUBLIC configuration values.
 * NEVER put secret keys here - they should only be in the backend.
 */

const CONFIG = {
  /*
   * Payment integration temporarily disabled — site uses Pay on Arrival + Netlify Forms.
   * Paystack or other payment config (public key only — never secrets):
   *
   * paystack: {
   *   publicKey: 'pk_test_YOUR_PUBLIC_KEY_HERE',
   *   currency: 'GHS',
   *   channels: ['card', 'mobile_money']
   * },
   */

  // Google Maps Configuration
  googleMaps: {
    // Replace with your actual Google Maps API key
    apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
    
    // Default coordinates (Ghana)
    defaultCenter: { lat: 7.9465, lng: -1.0232 },
    defaultZoom: 7
  },

  // Backend API Configuration
  api: {
    // Base URL for backend API
    // For local development: 'http://localhost:3000'
    // For production: 'https://your-api-domain.com'
    baseUrl: window.location.hostname === 'localhost' 
      ? 'http://localhost:3000' 
      : 'https://api.lonashtours.com',
    
    // API endpoints
    endpoints: {
      verifyPayment: '/api/verify-payment',
      initiatePayment: '/api/initiate-payment',
      paymentStatus: '/api/payment-status',
      health: '/api/health'
    }
  },

  // WhatsApp Configuration
  whatsapp: {
    // Business WhatsApp number (with country code, no + or spaces)
    phoneNumber: '233505402562',
    
    // Default message when starting chat
    defaultMessage: 'Hello LonAsh Tours, I would like to enquire about a tour.'
  },

  // Business Information
  business: {
    name: 'LonAsh Tours',
    legalName: 'LonAsh Company Limited',
    email: 'lonashcomapanylimited@gmail.com',
    phone: '+233 50 540 2562',
    address: '91 Kotokuraba Rd, Cape Coast, Ghana',
    
    // Social Media
    social: {
      facebook: 'https://facebook.com/lonashtours',
      instagram: 'https://instagram.com/lonashtours',
      whatsapp: 'https://wa.me/233505402562'
    },
    
    // Operating Hours
    hours: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed'
    }
  },

  // Currency Formatting
  currency: {
    locale: 'en-GH',
    code: 'GHS',
    symbol: 'GH₵'
  },

  // Feature Flags
  features: {
    enablePaystack: false,
    enableMobileMoney: false,
    enableWhatsAppChat: true,
    enableCustomTrips: true,
    enableReviews: true
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
