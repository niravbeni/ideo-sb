# 🚀 Quick Start Guide

Get your soundboard running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Add Sound Files

You need 12 animal sound MP3 files. Add them to `public/sounds/`:

- dog.mp3
- cat.mp3
- cow.mp3
- duck.mp3
- sheep.mp3
- pig.mp3
- rooster.mp3
- chicken.mp3
- horse.mp3
- frog.mp3
- lion.mp3
- owl.mp3

**Quick sources:**
- [Freesound.org](https://freesound.org/) - Free with attribution
- [Zapsplat.com](https://www.zapsplat.com/) - Free account needed

**Optional: Check if you have all files:**
```bash
npm run check-sounds
```

## Step 3: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Step 4: Test the App

1. **Click any animal button** - Should play sound
2. **Click custom slot (bottom row)** - Start recording
3. **Click "⚙️ Manage"** - Upload sounds, adjust volume
4. **Try offline** - Reload with network disabled

## Step 5: Build & Deploy

```bash
npm run build
```

Then deploy to [Vercel](https://vercel.com):
1. Push to GitHub
2. Import in Vercel
3. Deploy automatically
4. Your soundboard is live! 🚀

## That's It!

For detailed documentation, see:
- **README.md** - Full feature list
- **SETUP.md** - Detailed setup guide
- **DEPLOYMENT.md** - Deployment instructions

## Common Issues

**Sounds not playing?**
- Make sure MP3 files are in `public/sounds/`
- File names must match exactly

**Recording not working?**
- Grant microphone permission
- Try different browser

**PWA not installing?**
- Use HTTPS in production
- Use Safari on iOS

Need help? Check the troubleshooting section in `SETUP.md`!

---

Built with Next.js + TypeScript + Tailwind CSS + PWA 🎵

