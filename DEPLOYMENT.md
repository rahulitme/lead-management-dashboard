# Deployment Guide

## Quick Deployment (Free Providers)

This guide shows how to deploy the Lead Management Dashboard to free hosting providers.

## Backend Deployment (Render.com)

### Prerequisites
- GitHub account with your code pushed
- Render.com account (free)
- MongoDB Atlas account (free)

### Steps

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Render.com Account:**
   - Go to [render.com](https://render.com)
   - Sign up and connect GitHub

3. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Select your repository
   - Choose the `backend` directory as root

4. **Configure Service:**
   - **Name:** `lead-management-api`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. **Add Environment Variables:**
   ```
   MONGODB_URI=<your_mongodb_atlas_connection_string>
   JWT_SECRET=<generate_a_strong_secret_key>
   NODE_ENV=production
   ```

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for build to complete
   - Note your API URL: `https://lead-management-api.onrender.com`

### MongoDB Atlas Setup (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a free cluster
4. Go to Databases → Create Database User
   - Username: `admin`
   - Password: Generate strong password
5. Get Connection String:
   - Databases → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your user password
   - Add `/lead_management` to path for database name

Example:
```
mongodb+srv://admin:YourPassword@cluster0.mongodb.net/lead_management?retryWrites=true&w=majority
```

6. Whitelist IP:
   - Network Access → Add IP Address
   - Select "Allow Access from Anywhere" for free tier

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub repo with frontend code
- Vercel account (free)

### Steps

1. **Prepare Frontend:**
   - Ensure `vite.config.js` is correct
   - Update environment variable references

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Select `frontend` as root directory

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. **Environment Variables:**
   - Add `VITE_API_URL`: Your Render backend URL
   - Example: `https://lead-management-api.onrender.com/api`

5. **Deploy:**
   - Click "Deploy"
   - Your app will be available at provided URL

## Alternative Deployments

### Backend Alternatives
- **Railway.app** - Similar to Render, very easy
- **Heroku** - No longer free, but good documentation
- **DigitalOcean App Platform** - Affordable ($5/month)

### Frontend Alternatives
- **Netlify** - Similar to Vercel
- **GitHub Pages** - Free but limited
- **Firebase Hosting** - Free tier available

## Post-Deployment Steps

1. **Test API Health:**
   ```
   https://lead-management-api.onrender.com/api/health
   ```

2. **Seed Database:**
   - If not done during deployment, run seed command
   - Note: Need to give backend permission to run scripts

3. **Update Frontend API URL:**
   - If you haven't already, update the API URL in frontend env

4. **Test Login:**
   - Username: `demo`
   - Password: `demo123`

## Monitoring & Maintenance

### Render Logs
- Dashboard → Service → Logs
- See real-time server output

### Vercel Analytics
- Project → Analytics
- Monitor traffic and performance

### MongoDB Atlas Monitoring
- Cluster → Monitoring
- Check database performance and usage

## Troubleshooting

### Backend not starting
- Check logs on Render
- Verify MongoDB connection string is correct
- Ensure all environment variables are set
- Check `npm start` script in package.json

### Frontend can't reach backend
- Verify API URL in .env.production.local
- Check CORS headers in Express server
- Verify backend is actually running

### Database connection failed
- Check MongoDB Atlas IP whitelist
- Verify username/password in connection string
- Ensure database user exists
- Check network connectivity

### Seed data not loaded
- Manually run seed job on backend
- Or insert test data through MongoDB Atlas

## Cost Estimation

- **Render.com:** Free (with limitations)
- **Vercel:** Free (with limitations)
- **MongoDB Atlas:** Free 512MB tier
- **Total Monthly Cost:** $0 (free tier usage)

## Performance Tips

1. **Add Caching:**
   - Cache lead queries on frontend
   - Implement Redis on backend (paid)

2. **Optimize Database:**
   - Add indexes (already done)
   - Cleanup old logs periodically

3. **CDN for Frontend:**
   - Vercel includes CDN
   - Already optimized

## Security Notes

1. Change demo credentials in production
2. Use strong JWT secret
3. Enable HTTPS (automatic on Vercel/Render)
4. Keep dependencies updated
5. Rotate MongoDB credentials regularly

## Custom Domain (Optional)

### Vercel Custom Domain
- Settings → Domains
- Add your custom domain
- Update DNS records

### Render Custom Domain
- Environment → Custom Domains
- Add domain and follow DNS instructions

---

For support, check the main [README.md](../README.md)
