#!/usr/bin/env node

/**
 * Check if all required sound files are present
 * Run with: node scripts/check-sounds.js
 */

const fs = require('fs');
const path = require('path');

const SOUNDS_DIR = path.join(__dirname, '../public/sounds');
const REQUIRED_SOUNDS = [
  'dog.mp3',
  'cat.mp3',
  'cow.mp3',
  'duck.mp3',
  'sheep.mp3',
  'pig.mp3',
  'rooster.mp3',
  'chicken.mp3',
  'horse.mp3',
  'frog.mp3',
  'lion.mp3',
  'owl.mp3',
];

console.log('🔍 Checking for animal sound files...\n');

let allPresent = true;
const missing = [];
const present = [];

REQUIRED_SOUNDS.forEach((sound) => {
  const soundPath = path.join(SOUNDS_DIR, sound);
  
  if (fs.existsSync(soundPath)) {
    const stats = fs.statSync(soundPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    present.push(`✅ ${sound} (${sizeKB} KB)`);
  } else {
    missing.push(`❌ ${sound}`);
    allPresent = false;
  }
});

// Print results
console.log('📦 Present files:');
present.forEach((line) => console.log(`  ${line}`));

if (missing.length > 0) {
  console.log('\n⚠️  Missing files:');
  missing.forEach((line) => console.log(`  ${line}`));
  
  console.log('\n📝 Instructions:');
  console.log('  1. Download animal sound MP3 files');
  console.log('  2. Place them in public/sounds/');
  console.log('  3. See public/sounds/README.md for sources');
  
  process.exit(1);
} else {
  console.log('\n✅ All sound files present!');
  console.log('🚀 Ready to run: npm run dev\n');
  process.exit(0);
}

