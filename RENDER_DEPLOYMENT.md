# 🚀 Deploy to Render - Complete Guide

## Prerequisites ✅

Before starting, make sure you have:
- [ ] GitHub account (free)
- [ ] Render account (free tier available)
- [ ] Your project pushed to GitHub
- [ ] Backend already deployed on Render (you mentioned it's already there)

---

## Step 1: Push Your Project to GitHub

### If you haven't already:

```bash
# Initialize git (if not done)
cd c:\Users\jeann\OneDrive - MSFT\Velasco\layug-songs
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Music streaming app"

# Create repo on GitHub (via web):
# 1. Go to https://github.com/new
# 2. Create repo name: "layug-songs"
# 3. Copy the commands from GitHub

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/layug-songs.git
git branch -M main
git push -u origin main
```

### Verify on GitHub:
- Visit: `https://github.com/YOUR_USERNAME/layug-songs`
- All files should be there ✓

---

## Step 2: Deploy Frontend to Render

### 2a. Go to Render Dashboard
1. Visit: https://dashboard.render.com/
2. Sign in with GitHub (recommended)
3. Click "New +" button
4. Select "Static Site"

### 2b. Connect GitHub Repository
1. Click "Connect Repository"
2. Search: "layug-songs"
3. Click "Connect"

### 2c. Configure Build Settings

Fill in these fields:

| Field | Value |
|-------|-------|
| **Name** | `layug-songs` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Environment** | Leave blank for now |

**Screenshot of Build Command:**
```
npm install && npm run build
```

**Screenshot of Publish Directory:**
```
dist
```

### 2d. Deploy
1. Click "Create Static Site"
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `https://layug-songs-xxxxx.onrender.com`

---

## Step 3: Configure Environment Variables (if needed)

### Update Your API URL (if different from current)

If your backend URL is different from `https://song-api-rvfw.onrender.com`:

#### 3a. Create `.env` file

```bash
# In project root create file: .env
VITE_API_URL=https://song-api-rvfw.onrender.com
```

#### 3b. Update axiosInstance.js

```javascript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://song-api-rvfw.onrender.com',
  timeout: 10000,
});
```

#### 3c. Add Environment Variable in Render
1. Go to Render dashboard
2. Select your `layug-songs` site
3. Go to "Environment"
4. Add variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://song-api-rvfw.onrender.com`
5. Click "Save"
6. Redeploy

---

## Step 4: Verify Deployment

### Check Your Live App:
1. Visit your Render URL: `https://layug-songs-xxxxx.onrender.com`
2. You should see the app load
3. Try uploading a song:
   ```
   Title: Test Song
   Artist: Test Artist
   URL: https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3
   Genre: Test
   ```
4. Try playing the song ▶️

### Check Browser Console:
- Press F12 to open DevTools
- Go to Console tab
- Look for any errors
- Check Network tab to verify API calls work

---

## Complete Deployment Checklist

- [ ] GitHub account created
- [ ] Project pushed to GitHub repository
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] "New Static Site" created
- [ ] Repository selected: `layug-songs`
- [ ] Build command entered: `npm install && npm run build`
- [ ] Publish directory set: `dist`
- [ ] Deployment started
- [ ] Deployment completed (green status)
- [ ] Live URL obtained
- [ ] App loads in browser
- [ ] Can upload test song
- [ ] Can play test song
- [ ] Console shows no errors

---

## Post-Deployment: Custom Domain (Optional)

To use a custom domain like `layug-songs.com`:

1. Go to your Render site settings
2. Find "Custom Domain"
3. Enter your domain
4. Update DNS records at your domain registrar
5. Follow Render's DNS instructions

---

## Troubleshooting Deployment

### Issue: Build fails
**Solution:**
- Check build logs in Render dashboard
- Run locally: `npm run build`
- Fix any errors before pushing to GitHub

### Issue: App loads but API calls fail
**Solution:**
- Check CORS settings on your backend
- Verify API URL in `axiosInstance.js`
- Check Environment variables in Render
- Verify backend is still running

### Issue: Songs won't play
**Solution:**
- Make sure you're using proper audio URLs (not YouTube)
- Check browser console for audio errors
- Test with: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`

### Issue: Getting 404 on subpages
**Solution:**
- This is a common React Router issue
- Create `_redirects` file in `public` folder:
  ```
  /* /index.html 200
  ```

---

## `_redirects` File Setup

If you get 404 errors on routes like `/favorites` or `/playlists`:

### Create File: `public/_redirects`

```
/* /index.html 200
```

### What this does:
- Routes all requests to `index.html`
- React Router handles the routing
- Prevents 404 errors on page refresh

### Add to git:
```bash
git add public/_redirects
git commit -m "Add redirects for React Router"
git push
```

Then redeploy on Render.

---

## Update vite.config.js (Optional)

For better production builds:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
```

---

## Your Deployment URLs

Once deployed, you'll have:

| Service | URL |
|---------|-----|
| Frontend | `https://layug-songs-xxxxx.onrender.com` |
| Backend API | `https://song-api-rvfw.onrender.com` |
| GitHub Repo | `https://github.com/YOUR_USERNAME/layug-songs` |

---

## Final Steps

1. ✅ Push project to GitHub
2. ✅ Create Render account
3. ✅ Connect GitHub to Render
4. ✅ Create Static Site
5. ✅ Set build command: `npm install && npm run build`
6. ✅ Set publish directory: `dist`
7. ✅ Wait for deployment
8. ✅ Test the live app
9. ✅ Celebrate! 🎉

---

## Need Help?

### Common Issues & Solutions:

**Q: Where do I find my build logs?**
A: Render Dashboard → Your Site → Deployments tab

**Q: How do I redeploy after updates?**
A: Just push to GitHub, Render auto-deploys

**Q: Can I use a free Render account?**
A: Yes, free tier has limitations but works great

**Q: How long does deployment take?**
A: Usually 2-3 minutes for build + upload

---

## Summary

Your app will be live at: `https://layug-songs-xxxxx.onrender.com` ✅

With your backend already deployed, both frontend and backend will be working together!

**Ready to deploy? Let's go!** 🚀
