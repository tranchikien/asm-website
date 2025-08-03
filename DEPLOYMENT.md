# Deployment Guide - KIENSTORE

This guide will help you deploy the KIENSTORE application to production using Railway (Backend) and Vercel (Frontend).

## 🚀 Prerequisites

1. **GitHub Account**: Push your code to GitHub
2. **Railway Account**: For backend deployment
3. **Vercel Account**: For frontend deployment
4. **MongoDB Atlas**: For database

## 📋 Step 1: Prepare Your Code

### 1.1 Environment Variables
Create a `.env` file for local development:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_very_secure_jwt_secret_key
NODE_ENV=production
PORT=3000
```

### 1.2 Update API Configuration
In `js/config.js`, ensure the API_BASE_URL is set correctly:
```javascript
const API_BASE_URL = (() => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `http://localhost:${port || '3000'}`;
    }
    
    // Production - Railway backend
    return 'https://your-railway-app-name.up.railway.app';
})();
```

## 🚂 Step 2: Deploy Backend to Railway

### 2.1 Connect to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign in with your GitHub account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository

### 2.2 Configure Environment Variables
In Railway dashboard:
1. Go to your project
2. Click on "Variables" tab
3. Add the following variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_very_secure_jwt_secret_key
   NODE_ENV=production
   PORT=3000
   ```

### 2.3 Deploy Settings
1. Railway will automatically detect Node.js
2. Set the start command: `npm start`
3. Railway will deploy automatically on every push to main branch

### 2.4 Get Your Backend URL
After deployment, Railway will provide a URL like:
```
https://your-app-name.up.railway.app
```

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Connect to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository

### 3.2 Configure Build Settings
Vercel will auto-detect the settings, but verify:
- **Framework Preset**: Other
- **Build Command**: Leave empty (static site)
- **Output Directory**: Leave empty
- **Install Command**: Leave empty

### 3.3 Environment Variables (Optional)
If you need any frontend environment variables:
1. Go to Project Settings > Environment Variables
2. Add any required variables

### 3.4 Deploy
1. Click "Deploy"
2. Vercel will build and deploy your site
3. You'll get a URL like: `https://your-project.vercel.app`

## 🔧 Step 4: Update Frontend Configuration

### 4.1 Update API Base URL
After getting your Railway backend URL, update `js/config.js`:
```javascript
const API_BASE_URL = (() => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `http://localhost:${port || '3000'}`;
    }
    
    // Production - Railway backend
    return 'https://your-railway-app-name.up.railway.app';
})();
```

### 4.2 Update CORS Settings
In `server.js`, update the CORS origins:
```javascript
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://your-vercel-app.vercel.app', // Add your Vercel URL
        'https://your-vercel-app-git-main-yourusername.vercel.app' // Add Vercel preview URLs
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

## 🗄️ Step 5: Database Setup

### 5.1 MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Add it to Railway environment variables

### 5.2 Create Admin User
After deployment, run the admin creation script:
```bash
# Locally with production database
node create-admin.js
```

Or manually create admin user in MongoDB:
```javascript
{
  "email": "admin@kienstore.com",
  "password": "hashed_password",
  "fullname": "Admin User",
  "isAdmin": true
}
```

## 🔍 Step 6: Testing

### 6.1 Test Backend
1. Visit your Railway URL: `https://your-app.railway.app/api/health`
2. Should return: `{"status":"OK","timestamp":"..."}`

### 6.2 Test Frontend
1. Visit your Vercel URL
2. Test registration/login
3. Test admin panel (if admin user exists)
4. Test all features

## 🔒 Step 7: Security Considerations

### 7.1 Environment Variables
- Never commit `.env` files to Git
- Use strong JWT secrets
- Rotate secrets regularly

### 7.2 CORS Configuration
- Only allow necessary origins
- Remove localhost from production CORS

### 7.3 Database Security
- Use MongoDB Atlas with proper authentication
- Enable IP whitelist if needed
- Regular backups

## 📊 Step 8: Monitoring

### 8.1 Railway Monitoring
- Check Railway dashboard for logs
- Monitor resource usage
- Set up alerts for errors

### 8.2 Vercel Analytics
- Enable Vercel Analytics
- Monitor performance
- Track user behavior

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration in server.js
   - Verify frontend URL is in allowed origins
   - Check browser console for specific errors

2. **Database Connection Issues**
   - Verify MongoDB URI in Railway environment variables
   - Check MongoDB Atlas IP whitelist
   - Ensure database user has proper permissions

3. **Admin Access Issues**
   - Verify admin user exists in database
   - Check `isAdmin` field is set to `true`
   - Clear browser localStorage and login again

4. **Build Failures**
   - Check Railway logs for build errors
   - Verify package.json has correct scripts
   - Ensure all dependencies are listed

### Debug Commands

```bash
# Check Railway logs
railway logs

# Check Railway status
railway status

# Deploy manually
railway up

# Check environment variables
railway variables
```

## 🔄 Continuous Deployment

### Automatic Deployment
Both Railway and Vercel will automatically deploy when you push to your main branch.

### Manual Deployment
```bash
# Push to GitHub
git add .
git commit -m "Update for production"
git push origin main

# Railway and Vercel will auto-deploy
```

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Railway and Vercel documentation
3. Check browser console for frontend errors
4. Check Railway logs for backend errors

---

**Note**: This deployment guide assumes you're using the free tiers of Railway and Vercel. For production applications, consider upgrading to paid plans for better performance and support. 