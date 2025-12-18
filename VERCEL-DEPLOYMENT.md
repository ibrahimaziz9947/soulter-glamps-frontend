# Vercel Deployment Checklist

## ✅ Deployment Status
- **Frontend**: Deployed to Vercel
- **Production URL**: https://soulter-glamps-frontend-6d9kfhp2a-ibrahim-azizs-projects.vercel.app

## 🔧 Required Environment Variables

### In Vercel Dashboard:
1. Go to: https://vercel.com/ibrahim-azizs-projects/soulter-glamps-frontend/settings/environment-variables
2. Add the following variable:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-backend-domain.com` | Production |

**Important Notes:**
- Do NOT include `/api` suffix in the URL (it's added automatically)
- Value should be just the base domain: `https://your-backend-domain.com`
- If backend is on Render/Railway/etc, use that full URL
- This must be set as **Production** environment in Vercel

### Example Values:
```bash
# If backend is on Render:
NEXT_PUBLIC_API_BASE_URL=https://soulter-glamps-backend.onrender.com

# If backend is on Railway:
NEXT_PUBLIC_API_BASE_URL=https://soulter-glamps-backend.up.railway.app

# If backend is on Heroku:
NEXT_PUBLIC_API_BASE_URL=https://soulter-glamps-backend.herokuapp.com
```

## 📋 Deployment Steps

### 1. Set Environment Variables
```bash
# Via Vercel CLI:
vercel env add NEXT_PUBLIC_API_BASE_URL production

# Or via Dashboard:
# https://vercel.com/[your-team]/[your-project]/settings/environment-variables
```

### 2. Redeploy After Setting Env Vars
```bash
vercel --prod
```

**Important**: Environment variables are baked into the build at build time. If you change env vars in Vercel dashboard, you MUST redeploy for changes to take effect.

### 3. Verify Deployment
After deployment, check browser console:
- Should see: `[API Client] Base URL: https://your-backend-domain.com/api`
- Should NOT see: `Using localhost` warning

## 🔍 Testing Production Deployment

### Test Backend Connection:
1. Open production site
2. Open browser DevTools Console (F12)
3. Navigate to `/glamps` page
4. Check console output:
   - ✅ Good: `[API Client] Base URL: https://your-backend.com/api`
   - ❌ Bad: `Using localhost - set NEXT_PUBLIC_API_BASE_URL`

### Test Functionality:
- [ ] Glamps listing page loads
- [ ] Glamp details page loads
- [ ] Booking widget submits
- [ ] Booking confirmation page displays
- [ ] Admin/Agent/Super-Admin login works

## ⚠️ Common Issues

### Issue: "Using localhost" warning in production
**Solution**: Environment variable not set or needs rebuild
```bash
# Set the variable in Vercel dashboard, then:
vercel --prod
```

### Issue: CORS errors
**Solution**: Backend must allow your Vercel domain in CORS settings
```javascript
// Backend CORS config should include:
origin: [
  'https://soulter-glamps-frontend-6d9kfhp2a-ibrahim-azizs-projects.vercel.app',
  'https://soulter-glamps-frontend.vercel.app',
  // Add your custom domain if you have one
]
```

### Issue: API calls return 404
**Check**:
1. Backend is deployed and running
2. `NEXT_PUBLIC_API_BASE_URL` is correct
3. Backend routes match (should have `/api` prefix in routes)

## 🔐 Backend Configuration

Your backend must:
1. ✅ Accept CORS from Vercel domain
2. ✅ Support cookies with `credentials: 'include'`
3. ✅ Set `sameSite: 'none'` and `secure: true` for cookies in production
4. ✅ Use HTTPS (required for cross-origin cookies)

### Example Backend CORS Config:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000', // Local dev
    'https://soulter-glamps-frontend-6d9kfhp2a-ibrahim-azizs-projects.vercel.app',
    'https://soulter-glamps-frontend.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### Example Backend Cookie Config:
```javascript
// Production cookies must use:
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
})
```

## 📊 Monitoring

### Vercel Dashboard:
- **Deployments**: https://vercel.com/ibrahim-azizs-projects/soulter-glamps-frontend
- **Logs**: Check Functions logs for API errors
- **Analytics**: Monitor page views and performance

### Browser Console:
- All API calls logged with `[API Client]` prefix
- Network failures show clear error messages
- No localhost references should appear

## 🚀 Next Steps

1. [ ] Deploy backend to production host (Render/Railway/Heroku)
2. [ ] Get backend production URL
3. [ ] Set `NEXT_PUBLIC_API_BASE_URL` in Vercel
4. [ ] Redeploy frontend: `vercel --prod`
5. [ ] Configure backend CORS to allow Vercel domain
6. [ ] Test full booking flow in production
7. [ ] Set up custom domain (optional)

## 📝 Local Development

For local development, create `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
```

This file is gitignored and only used locally.
