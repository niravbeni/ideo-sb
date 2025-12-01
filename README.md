# 🎵 Soundboard PWA

A fully responsive Progressive Web App soundboard with 12 preset animal sounds and 4 custom upload slots.

## 🚀 Live Demo

Coming soon on Vercel!

## ✨ Features

- **16 Sound Slots**: 12 preset animal sounds + 4 custom upload slots
- **Upload from Main Page**: Click empty slots to upload audio directly
- **Low-Latency Playback**: Web Audio API for instant sound playback
- **Offline Support**: Full PWA with service worker caching
- **Fully Responsive**: Works on phone, tablet, and desktop
- **Local Storage**: All data stored in browser (IndexedDB + localStorage)
- **Global Volume Control**: Adjust volume with beautiful gradient slider
- **Upload/Replace**: Replace any sound via Settings page

## 🎮 Usage

### Main Page
- **Tap any sound button** to play instantly
- **Empty custom slots** (📤 blue buttons) - tap to upload audio
- **Playing sounds** show green with animation

### Settings Page
- **Upload/Replace** sounds for any slot
- **Reset** preset sounds to defaults
- **Clear** custom uploads
- **Adjust volume** with the gradient slider

## 🛠️ Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **next-pwa** for PWA support
- **idb** for IndexedDB storage
- **Web Audio API** for audio playback

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎵 Adding Sound Files

1. Add 12 animal sound MP3 files to `public/sounds/`:
   - dog.mp3, cat.mp3, cow.mp3, duck.mp3
   - sheep.mp3, pig.mp3, rooster.mp3, chicken.mp3
   - horse.mp3, frog.mp3, lion.mp3, owl.mp3

2. See `public/sounds/README.md` for free sound sources

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically
4. Add your sound files

## 📱 PWA Installation

### iOS/iPadOS
1. Open in Safari
2. Tap Share → Add to Home Screen

### Android
1. Open in Chrome
2. Tap menu → Install app

### Desktop
1. Look for install icon in address bar
2. Click to install

## 🎨 Customization

- **Emojis**: Edit `lib/slots.ts`
- **Colors**: Edit `tailwind.config.ts`
- **App name**: Edit `public/manifest.json`
- **Icons**: Replace files in `public/icons/`

## 📄 License

MIT License - feel free to use for any project!

## 🙏 Credits

Built with Next.js, TypeScript, and Tailwind CSS.
