# Deployment Guide

This guide covers deploying the Animal Soundboard PWA to various platforms.

## Vercel (Recommended)

Vercel is the easiest platform for deploying Next.js apps and is fully compatible with this PWA.

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configuration**
   - No special configuration needed
   - Vercel auto-detects Next.js
   - PWA service worker works out of the box

4. **Custom Domain** (Optional)
   - Add your domain in Project Settings
   - Update DNS records as instructed
   - SSL is automatic

### Environment Variables

None required! This app runs entirely client-side.

## Netlify

Netlify also supports Next.js with some configuration.

### Steps

1. **Create netlify.toml**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

2. **Deploy**
   - Connect your Git repository
   - Netlify will auto-deploy on push

## Static Export (Alternative)

If you want to deploy to basic static hosting:

### Modify next.config.js

```javascript
const nextConfig = {
  output: 'export',
  // ... rest of config
};
```

### Build

```bash
npm run build
```

This creates an `out/` directory with static files.

### Deploy Static Files

Upload the `out/` directory to:
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

## Important Notes

### Service Worker

- The service worker is generated at build time
- It caches the app shell and default sounds
- User-uploaded sounds are stored in IndexedDB (not cached by SW)

### Sound Files

Before deploying:
1. Add all 12 animal sound MP3s to `public/sounds/`
2. Remove placeholder files
3. Test locally first
4. Ensure total size is reasonable (<5MB recommended)

### PWA Icons

Consider replacing the placeholder SVG icons:
1. Create 192x192 and 512x512 PNG icons
2. Place in `public/icons/`
3. Update `manifest.json` to reference PNGs

### iOS Considerations

- Test PWA installation on actual iOS device
- Check audio playback in silent mode
- Verify recording permissions work
- Test offline mode thoroughly

## Performance Optimization

### Before Production

1. **Optimize Sound Files**
   - Convert to 128kbps MP3
   - Trim silence at start/end
   - Normalize volume levels

2. **Compress Assets**
   - Most platforms do this automatically
   - Vercel/Netlify handle compression

3. **Test Performance**
   - Use Lighthouse in Chrome DevTools
   - Aim for 90+ PWA score
   - Check mobile performance

### Monitoring

After deployment:
- Test on multiple devices
- Check browser console for errors
- Verify PWA installability
- Test offline functionality

## Troubleshooting

### Service Worker Not Updating

Force update:
```javascript
// In browser console
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    registrations.forEach(reg => reg.unregister());
  });
```

### Sounds Not Caching

Check:
- File paths are correct in `slots.ts`
- Files exist in `public/sounds/`
- Service worker is registered
- Check Network tab in DevTools

### PWA Not Installing

- Verify `manifest.json` is accessible
- Check HTTPS is enabled (required for PWA)
- Test in correct browser (Safari for iOS)
- Check browser console for manifest errors

## CI/CD

### GitHub Actions Example

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Security

### Headers

Consider adding security headers (Vercel handles most automatically):

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};
```

## Post-Deployment Checklist

- [ ] All 12 animal sounds load correctly
- [ ] PWA installs on iOS Safari
- [ ] PWA installs on Chrome (Android/Desktop)
- [ ] Sounds play on first tap (iOS)
- [ ] Recording works with microphone
- [ ] Upload/replace sounds works
- [ ] Volume control affects all sounds
- [ ] App works offline after first load
- [ ] Responsive on mobile, tablet, desktop
- [ ] No console errors
- [ ] Lighthouse PWA score > 90

## Support

For deployment issues:
- Check Vercel/Netlify logs
- Review browser console
- Test in multiple browsers
- Open GitHub issue if needed

