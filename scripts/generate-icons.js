// Simple script to generate placeholder PWA icons
// Run with: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

// Create a simple SVG and save as files
const createSVGIcon = (size) => `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#4F46E5"/>
  <text x="50%" y="50%" font-size="${size/4}" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial">🐾</text>
</svg>`;

const iconsDir = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG placeholders (user can convert to PNG if needed)
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.svg'), createSVGIcon(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.svg'), createSVGIcon(512));
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.svg'), createSVGIcon(180));

console.log('✓ Generated placeholder SVG icons in public/icons/');
console.log('  Note: For production, convert these to PNG or create custom icons.');
console.log('  You can use online tools like https://cloudconvert.com/svg-to-png');

