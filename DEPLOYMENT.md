# LonAsh Tours - Deployment Guide

## Production Deployment Checklist

### 1. Firebase Setup

1. **Create Production Firebase Project**
   - Go to https://console.firebase.google.com
   - Create new project "LonAsh Tours Production"
   - Enable Google Analytics if desired

2. **Enable Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in production mode"
   - Select region (us-central or europe-west)

3. **Set Firestore Security Rules**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read access to tours
       match /tours/{tourId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       
       // Allow create access to bookings for authenticated users
       match /bookings/{bookingId} {
         allow create: if true;
         allow read, update: if request.auth != null;
       }
       
       // Allow create access to custom trips
       match /customTrips/{tripId} {
         allow create: if true;
         allow read, update: if request.auth != null;
       }
       
       // Allow create access to messages
       match /messages/{messageId} {
         allow create: if true;
         allow read: if request.auth != null;
       }
     }
   }
   ```

4. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable "Email/Password"
   - Add admin user in "Users" tab

5. **Get Firebase Config**
   - Go to Project Settings > General
   - Under "Your apps", click the web icon (</>)
   - Copy the config object
   - Update `assets/js/firebase-config.js`

6. **Generate Service Account Key (for Backend)**
   - Go to Project Settings > Service accounts
   - Click "Generate new private key"
   - Save as `api/firebase-service-account.json`

### 2. Paystack Setup

1. **Create Paystack Account**
   - Sign up at https://paystack.com
   - Complete business verification

2. **Get API Keys**
   - Go to Dashboard > Settings > API Keys
   - Copy Test Keys for development
   - Copy Live Keys for production

3. **Configure Webhook**
   - Go to Settings > Webhooks
   - Add webhook URL: `https://api.lonashtours.com/api/webhook/paystack`
   - Enable `charge.success` event

4. **Update Configuration**
   - Update `assets/js/config.js` with public key
   - Update `api/.env` with secret key

### 3. Backend Deployment

#### Option A: Deploy to Railway (Recommended)

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Create Project**
   ```bash
   railway login
   railway init
   ```

3. **Add Environment Variables**
   ```bash
   railway variables set PAYSTACK_SECRET_KEY=sk_live_xxx
   railway variables set PAYSTACK_PUBLIC_KEY=pk_live_xxx
   railway variables set NODE_ENV=production
   railway variables set ALLOWED_ORIGINS=https://lonashtours.com
   ```

4. **Upload Service Account**
   - Go to Railway dashboard
   - Add `firebase-service-account.json` as a volume

5. **Deploy**
   ```bash
   railway up
   ```

#### Option B: Deploy to Heroku

1. **Create Heroku App**
   ```bash
   heroku create lonash-tours-api
   ```

2. **Set Environment Variables**
   ```bash
   heroku config:set PAYSTACK_SECRET_KEY=sk_live_xxx
   heroku config:set NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   git subtree push --prefix api heroku main
   ```

#### Option C: Deploy to VPS/Dedicated Server

1. **Install Node.js 18+**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and Setup**
   ```bash
   git clone <your-repo>
   cd Tourist/api
   npm install --production
   ```

3. **Create .env file**
   ```bash
   nano .env
   # Add all environment variables
   ```

4. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

5. **Start with PM2**
   ```bash
   pm2 start server.js --name "lonash-api"
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name api.lonashtours.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Enable SSL with Certbot**
   ```bash
   sudo certbot --nginx -d api.lonashtours.com
   ```

### 4. Frontend Deployment

#### Option A: Deploy to Netlify

1. **Connect Repository**
   - Go to https://app.netlify.com
   - Click "Add new site" > "Import an existing project"
   - Connect GitHub/GitLab repository

2. **Build Settings**
   - Build command: (leave blank for static HTML)
   - Publish directory: `/`

3. **Add Environment Variables**
   - Not needed for static HTML

4. **Configure Redirects**
   - Create `_redirects` file:
   ```
   /* /index.html 200
   ```

5. **Custom Domain**
   - Add custom domain: `lonashtours.com`
   - Configure DNS

#### Option B: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

#### Option C: Traditional Web Hosting

1. **Upload Files**
   - Use FTP/SFTP to upload all files to `public_html`
   - Or use cPanel File Manager

2. **Configure Domain**
   - Point A record to server IP
   - Wait for DNS propagation

### 5. Post-Deployment Testing

#### Payment Flow Testing
1. Visit booking page
2. Select a tour
3. Fill in details
4. Choose "Mobile Money" payment
5. Complete test payment
6. Verify booking appears in admin dashboard
7. Verify payment status updated

#### Admin Dashboard Testing
1. Login to admin panel
2. Check dashboard stats
3. View bookings list
4. Click on booking details
5. Test status updates
6. Add new tour
7. Check tour appears on frontend

#### Custom Trip Testing
1. Visit custom-trip.html
2. Fill multi-step form
3. Submit request
4. Verify in admin dashboard
5. Test WhatsApp integration

### 6. Monitoring & Maintenance

#### Set up Monitoring
- Install Firebase Performance Monitoring
- Set up Google Analytics
- Configure error tracking (Sentry recommended)

#### Regular Backups
- Enable Firestore automated backups
- Backup Firebase Auth users
- Store service account keys securely

#### Updates
- Keep dependencies updated
- Monitor Paystack API changes
- Check Firebase security rules periodically

## Troubleshooting

### Common Issues

1. **Payment not verifying**
   - Check backend logs: `railway logs` or `pm2 logs`
   - Verify webhook URL is accessible
   - Check Paystack dashboard for webhook errors

2. **Firebase permission denied**
   - Check Firestore security rules
   - Verify user is authenticated for admin functions
   - Check browser console for errors

3. **Backend not connecting to Firebase**
   - Verify `firebase-service-account.json` exists
   - Check file permissions (600 recommended)
   - Verify service account has Firestore access

4. **CORS errors**
   - Check `ALLOWED_ORIGINS` in backend .env
   - Verify frontend domain matches
   - Check backend is running

### Support Contacts

- **Paystack Support**: https://paystack.com/support
- **Firebase Support**: https://firebase.google.com/support
- **LonAsh Dev Team**: lonashcomapanylimited@gmail.com

## Security Checklist

- [ ] Paystack keys are environment variables (not in code)
- [ ] Firebase service account key is secure
- [ ] Firestore rules restrict write access
- [ ] Admin panel requires authentication
- [ ] HTTPS enabled on all domains
- [ ] CORS configured for production domain only
- [ ] API rate limiting enabled
- [ ] Webhook secrets validated (if implemented)

## Performance Optimization

- [ ] Images optimized and using lazy loading
- [ ] CSS/JS minified (if using build process)
- [ ] CDN configured for static assets
- [ ] Firebase caching rules configured
- [ ] Backend response compression enabled

---

**Last Updated**: April 2026
**Version**: 2.0
