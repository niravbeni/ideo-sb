# Setup Guide

Quick start guide to get your Animal Soundboard PWA up and running.

## Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- A modern web browser

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 15+
- React 18
- TypeScript
- Tailwind CSS
- next-pwa
- idb (IndexedDB wrapper)

### 2. Add Animal Sound Files

This is the most important step! The app needs 12 animal sound MP3 files.

**Navigate to the sounds directory:**
```bash
cd public/sounds
```

**Add these 12 files:**
1. `dog.mp3`
2. `cat.mp3`
3. `cow.mp3`
4. `duck.mp3`
5. `sheep.mp3`
6. `pig.mp3`
7. `rooster.mp3`
8. `chicken.mp3`
9. `horse.mp3`
10. `frog.mp3`
11. `lion.mp3`
12. `owl.mp3`

**Where to find sounds:**
- Freesound.org (free with attribution)
- Zapsplat.com (free account required)
- BBC Sound Effects (free for personal use)
- SoundBible.com (various licenses)

**Recommendations:**
- Keep files under 500KB each
- 1-3 seconds duration ideal
- MP3 format at 128kbps
- 44.1kHz sample rate

See `public/sounds/README.md` for detailed instructions.

### 3. (Optional) Customize PWA Icons

Replace the placeholder SVG icons with custom PNG icons:

**Create PNG icons:**
- 192x192 pixels → `public/icons/icon-192x192.png`
- 512x512 pixels → `public/icons/icon-512x512.png`
- 180x180 pixels → `public/icons/apple-touch-icon.png`

**Update manifest.json:**
```json
{
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Test the App

**Main Page:**
- [ ] Click each animal sound button
- [ ] Sounds play correctly
- [ ] Visual feedback works (button states)
- [ ] Adjust volume using slider in Manage page

**Recording (Custom Slots):**
- [ ] Click a custom slot (slots 13-16)
- [ ] Grant microphone permission
- [ ] Record a sound
- [ ] Click again to stop
- [ ] Recording plays back

**Manage Page:**
- [ ] Upload a custom sound file
- [ ] Reset a preset to default
- [ ] Clear a custom recording
- [ ] Volume slider works

**PWA Features:**
- [ ] Install icon appears in browser
- [ ] App installs successfully
- [ ] Works offline after first load

## Development Tips

### Hot Reload

Next.js provides hot reload in development:
- Save any file
- Browser automatically updates
- State is preserved when possible

### Console Debugging

Open browser DevTools (F12) to:
- Check for errors in Console
- Monitor Network requests
- Inspect IndexedDB storage
- Test PWA features in Application tab

### Audio Context

On first load:
- Audio context requires user interaction (iOS requirement)
- First button click initializes audio
- All subsequent clicks work immediately

### Storage

Check stored data:
1. Open DevTools → Application
2. **localStorage** → see slot metadata and volume
3. **IndexedDB** → see uploaded/recorded audio blobs

## Building for Production

### Build

```bash
npm run build
```

This creates an optimized production build in `.next/`.

### Test Production Build Locally

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to test production build.

### Production Checklist

Before deploying:
- [ ] All 12 animal sounds added
- [ ] PWA icons customized (optional)
- [ ] App tested on desktop
- [ ] App tested on mobile
- [ ] Recording works
- [ ] Upload works
- [ ] Offline mode works
- [ ] No console errors

## Troubleshooting

### "Cannot find module" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Sounds not playing

- Ensure MP3 files exist in `public/sounds/`
- Check file names match exactly (case-sensitive)
- Open DevTools → Network to see 404 errors
- Verify audio format is supported by browser

### PWA not installing

- Must use HTTPS in production (localhost is OK for dev)
- Check manifest.json is accessible
- Verify service worker registers
- Use correct browser (Safari for iOS, Chrome for Android)

### Recording not working

- Grant microphone permission
- Use HTTPS (required for getUserMedia)
- Check browser supports MediaRecorder
- Test in different browser

### Build errors

Check Node.js version:
```bash
node --version  # Should be 18+
```

Update dependencies:
```bash
npm update
```

## Next Steps

1. **Customize**: Change colors, emojis, labels in `lib/slots.ts`
2. **Deploy**: Follow `DEPLOYMENT.md` for Vercel deployment
3. **Test**: Use on real devices (iOS, Android, desktop)
4. **Share**: Install on home screen and use it!

## Support

- Check `README.md` for full documentation
- See `DEPLOYMENT.md` for deployment guides
- Open issues on GitHub for bugs
- Check browser console for error messages

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Check for code issues |

## Files You Should Modify

1. **`public/sounds/*.mp3`** - Add your sound files
2. **`public/icons/*.png`** - Custom PWA icons (optional)
3. **`public/manifest.json`** - App name, colors (optional)
4. **`lib/slots.ts`** - Customize slot labels/emojis (optional)

## Files You Should NOT Modify

- `next.config.js` - PWA configuration (unless you know what you're doing)
- `lib/audio.ts` - Audio system (complex)
- `lib/storage.ts` - Storage system (complex)
- Generated files in `.next/`, `node_modules/`

---

Happy soundboarding! 🎵🐾

