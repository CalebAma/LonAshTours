# LonAsh Tours - Enhanced Tourism Website

A modern, high-converting tourism platform for Ghana with smooth booking, secure payments, and strong user engagement.

## 🚀 Major Improvements Implemented

### 1. Booking System Enhancement
- **Structured booking form** with fields for name, email, phone, tour selection, travel date, number of people, and special requests
- **Multi-step booking flow**: Details → Payment → Confirmation
- **Form validation** for required fields and valid phone/email formats
- **Booking reference generation** for tracking

### 2. Paystack Payment Integration
- **Backend payment verification API** (Node.js/Express) for secure transaction processing
- **Mobile Money support**: MTN MoMo, Telecel Cash, AirtelTigo Money
- **Payment status tracking**: Paid, Pending, Failed, Unpaid
- **Webhook handling** for automatic payment status updates
- **Transaction verification** on both frontend and backend
- **Payment reference tracking** for reconciliation

### 3. WhatsApp Integration
- **Floating WhatsApp button** on all pages with pulse animation
- **Pre-filled messages** when contacting support
- **Quick contact links** in booking confirmation and contact page

### 4. Google Maps Integration
- **Embedded maps** on Destinations page with interactive region selection
- **Contact page map** showing office location
- **Configuration system** for Google Maps API key

### 5. Tours Page Enhancement
- **Tour cards** with image, title, description, duration, price, and action buttons
- **Filtering options**: By category (Adventure, Educational, Wildlife, Nature, Cultural)
- **Duration filtering**: Short (1-2 days), Medium (3-5 days), Long (6+ days)
- **Search functionality** for tours
- **Sorting options**: Featured, Price Low-High, Price High-Low
- **View Details modal** with comprehensive tour information
- **Featured tour badges** for highlighted packages
- **"Can't find what you want?"** CTA linking to custom trip form

### 6. Home Page Optimization
- **Strong hero headline** with clear value proposition
- **CTA buttons**: "Book Now" and "Explore Tours"
- **Featured tours section** dynamically loaded from Firestore
- **"Why Choose Us" section** with trust indicators
- **Testimonials/Reviews section** with customer feedback

### 7. Destinations Page
- **Interactive destination cards** with expandable details
- **Region-based map display** using Google Maps embeds
- **Quick booking links** for each destination
- **WhatsApp integration** for custom itinerary requests

### 8. Contact Page
- **Functional contact form** with Firebase integration
- **Business details**: Address, phone, email, operating hours
- **Embedded Google Maps**
- **WhatsApp quick contact option**

### 9. Blog Page
- **Improved layout** with article cards
- **Preview cards** with image, title, category, date, and excerpt
- **Newsletter subscription section**

### 10. Admin Portal Enhancement
- **Dashboard overview** with key metrics:
  - Total bookings count
  - Paid bookings count
  - Pending bookings count
  - Total revenue (calculated from paid bookings)
- **Bookings management** with:
  - Payment status badges (Paid, Pending, Unpaid, Failed)
  - Booking status badges (Confirmed, Pending, Cancelled)
  - Booking details modal with full information
  - WhatsApp contact integration
  - Status update actions
- **Custom Trips tab** for managing tailor-made tour requests
- **Tour management** with:
  - Duration field
  - Featured tour checkbox
  - Image preview
  - Category selection
- **Business settings** configuration

### 11. "Customize Your Trip" Feature
- **Dedicated custom-trip.html page**
- **Multi-step form**:
  1. Contact Information (name, email, phone, group size)
  2. Destinations & Activities (8 destinations, 12 activity types)
  3. Travel Details (dates, pickup location, accommodation preferences)
  4. Review & Submit (summary with special requests)
- **Budget selection**: Budget-Friendly, Mid-Range, Luxury, Ultra-Luxury
- **Duration selection**: 1-2 Days, 3-5 Days, 6-10 Days, 10+ Days
- **Special requirements**: Dietary, accessibility, additional requests

### 12. Performance & UX
- **Responsive design** across all devices
- **Loading states** for async operations
- **Toast notifications** for user feedback
- **Smooth animations** and transitions
- **Lazy loading** for images
- **Scroll reveal animations**

## 📁 Project Structure

```
Tourist/
├── index.html              # Home page with hero, featured tours, testimonials
├── tours.html              # Tour listings with filtering and modal
├── destinations.html       # Ghana destinations with maps
├── booking.html            # Booking form with Paystack integration
├── custom-trip.html        # Custom trip request form
├── contact.html            # Contact form and business details
├── blog.html               # Blog/insights page
├── about.html              # About page
├── gallery.html            # Gallery page
├── assets/
│   ├── css/
│   │   └── styles.css      # Custom styles, animations
│   ├── js/
│   │   ├── main.js         # Main JavaScript utilities
│   │   ├── firebase-config.js  # Firebase configuration
│   │   └── config.js       # App configuration (API keys, business info)
│   └── images/             # Image assets
├── admin/
│   ├── login.html          # Admin login
│   └── dashboard.html      # Admin dashboard
└── api/
    ├── server.js           # Node.js backend for Paystack
    ├── package.json        # Backend dependencies
    ├── .env.example        # Environment variables template
    └── .gitignore          # Git ignore rules
```

## 🔧 Configuration

### Paystack Setup
1. Get your Paystack API keys from https://paystack.com
2. Update `assets/js/config.js`:
   ```javascript
   paystack: {
       publicKey: 'pk_live_YOUR_PUBLIC_KEY'
   }
   ```
3. Update `api/.env`:
   ```
   PAYSTACK_SECRET_KEY=sk_live_YOUR_SECRET_KEY
   ```

### Google Maps Setup
1. Get a Google Maps API key from Google Cloud Console
2. Update `assets/js/config.js`:
   ```javascript
   googleMaps: {
       apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
   }
   ```

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore and Authentication
3. Download service account key for backend
4. Update `assets/js/firebase-config.js` with your Firebase config

## 🚀 Backend Setup

### Prerequisites
- Node.js 18+ installed
- Firebase service account key

### Installation
```bash
cd api
npm install
```

### Environment Variables
Create `api/.env`:
```env
PAYSTACK_SECRET_KEY=sk_test_or_live_your_key
PAYSTACK_PUBLIC_KEY=pk_test_or_live_your_key
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://lonashtours.com,https://www.lonashtours.com
```

### Running the Backend
```bash
# Development
npm run dev

# Production
npm start
```

## 🔐 Security Features

- **Backend payment verification**: All payments verified server-side with Paystack API
- **Webhook security**: Paystack webhooks for real-time payment status updates
- **Firebase Auth**: Secure admin authentication
- **CORS configuration**: Restricted API access
- **Environment variables**: No secrets in client-side code

## 📱 Mobile Money Support

The system supports all major Ghana mobile money providers:
- **MTN Mobile Money**
- **Telecel Cash** (formerly Vodafone Cash)
- **AirtelTigo Money**

Users can select their preferred provider during checkout.

## 📊 Admin Dashboard Features

### Dashboard Overview
- Real-time statistics
- Revenue tracking
- Booking status breakdown

### Booking Management
- View all bookings with filtering
- Update booking status (Confirm, Cancel)
- View payment status
- Contact customer via WhatsApp
- Detailed booking view modal

### Tour Management
- Add new tours with all details
- Set duration and pricing
- Mark tours as featured
- Delete tours

### Custom Trips
- View all custom trip requests
- See customer preferences
- Track request status

## 🎨 Design System

### Colors
- **Primary Blue**: `#1E40AF` (lonash-blue)
- **Primary Orange**: `#F97316` (lonash-orange)
- **Success**: Green for confirmations
- **Warning**: Yellow for pending states
- **Error**: Red for cancellations/failures

### Typography
- **Headings**: Poppins (600, 700)
- **Body**: Inter (400, 500, 600, 700)

### Components
- Rounded corners (rounded-xl, rounded-2xl, rounded-3xl)
- Shadow effects for cards
- Smooth transitions (300ms ease)
- Responsive grid layouts

## 📝 Next Steps for Production

1. **Set up Firebase**:
   - Create production project
   - Set up Firestore security rules
   - Configure Authentication

2. **Configure Paystack**:
   - Switch from test to live keys
   - Set up webhooks endpoint
   - Configure payment channels

3. **Deploy Backend**:
   - Deploy to Heroku, Railway, or similar
   - Set environment variables
   - Configure CORS for production domain

4. **SEO Optimization**:
   - Add meta descriptions to all pages
   - Create sitemap.xml
   - Set up Google Analytics

5. **Testing**:
   - Test payment flow end-to-end
   - Verify mobile responsiveness
   - Check all form validations

## 🤝 Support

For questions or issues, contact:
- **Email**: lonashcomapanylimited@gmail.com
- **WhatsApp**: +233 50 540 2562
- **Website**: https://lonashtours.com

---

Built with ❤️ by LonAsh Tours Team
