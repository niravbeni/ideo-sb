# 🚀 Vercel Deployment Guide

Your code is now on GitHub and ready to deploy to Vercel!

## Repository
📦 **GitHub**: https://github.com/niravbeni/ideo-sb

## Quick Deploy Steps

### 1. Go to Vercel
Visit: https://vercel.com/new

### 2. Import Your Repository
- Click "Add New..." → "Project"
- Select "Import Git Repository"
- Choose: `niravbeni/ideo-sb`
- Click "Import"

### 3. Configure Project
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./`
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

**No environment variables needed!**

### 4. Deploy
- Click "Deploy"
- Wait 2-3 minutes for build to complete
- Get your live URL: `https://your-project.vercel.app`

## ✅ Post-Deployment Checklist

### Immediate Testing
1. [ ] Visit your Vercel URL
2. [ ] Check if all 12 animal sounds load (once you add MP3 files)
3. [ ] Test uploading custom sounds
4. [ ] Test volume slider
5. [ ] Check Settings page works
6. [ ] Verify responsiveness on mobile

### PWA Testing
1. [ ] Try installing on iOS Safari
2. [ ] Try installing on Chrome (desktop/Android)
3. [ ] Test offline mode after first load
4. [ ] Check if icon appears correctly

### Sound Files
⚠️ **Important**: The app is deployed but needs sound files!

**Add sound files:**
1. Create 12 MP3 files for animal sounds
2. Add them to `public/sounds/` locally
3. Commit and push:
   ```bash
   git add public/sounds/*.mp3
   git commit -m "Add animal sound MP3 files"
   git push
   ```
4. Vercel auto-deploys on push!

**Or use Vercel CLI:**
```bash
npx vercel --prod
```

## 🎨 Customization

### Change App Name
1. Edit `public/manifest.json` → change "name"
2. Edit `app/layout.tsx` → change title
3. Commit and push

### Add Custom Domain
1. Go to Vercel project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Update Icons
1. Replace files in `public/icons/`
2. Use 192x192 and 512x512 PNG files
3. Commit and push

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# Vercel deploys automatically!
```

## 📊 Monitoring

### View Deployments
https://vercel.com/niravbeni/ideo-sb

### Check Analytics
Vercel Dashboard → Your Project → Analytics

### View Logs
Vercel Dashboard → Your Project → Logs

## ⚡ Performance Tips

Your app is already optimized:
- ✅ Static generation for fast loads
- ✅ Service worker for offline support
- ✅ Preloading for instant playback
- ✅ Edge network via Vercel

## 🐛 Troubleshooting

### Sounds Not Playing
- Add MP3 files to `public/sounds/`
- Verify file names match `slots.ts`
- Check browser console for 404 errors

### PWA Not Installing
- Ensure HTTPS (Vercel uses HTTPS by default)
- Check manifest.json is accessible
- Use Safari for iOS, Chrome for Android

### Build Fails
- Check build logs in Vercel dashboard
- Ensure `package.json` dependencies are correct
- Try building locally: `npm run build`

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Issues**: https://github.com/niravbeni/ideo-sb/issues

---

## 🎉 You're Live!

Your soundboard is now deployed at:
**https://your-project.vercel.app**

Share it with the world! 🎵

