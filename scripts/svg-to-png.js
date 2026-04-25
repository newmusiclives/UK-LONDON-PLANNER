#!/usr/bin/env node
// scripts/svg-to-png.js
// Convert the social-creative SVGs to PNG at upload-ready dimensions
// (Instagram 1080x1080, Pinterest 1000x1500). Pure Node — uses the
// @resvg/resvg-js dev dep, no system tools required.
//
// Usage:  npm run convert:social
//   or:   node scripts/svg-to-png.js

const fs = require('fs');
const path = require('path');

let Resvg;
try {
  ({ Resvg } = require('@resvg/resvg-js'));
} catch {
  console.error('Missing dep. Run: npm install');
  process.exit(1);
}

const REPO = path.resolve(__dirname, '..');

const TARGETS = [
  { src: 'images/social/instagram/01-marylebone.svg',         w: 1080, h: 1080 },
  { src: 'images/social/instagram/02-spitalfields.svg',       w: 1080, h: 1080 },
  { src: 'images/social/instagram/03-notting-hill.svg',       w: 1080, h: 1080 },
  { src: 'images/social/instagram/04-bloomsbury.svg',         w: 1080, h: 1080 },
  { src: 'images/social/instagram/05-bermondsey.svg',         w: 1080, h: 1080 },
  { src: 'images/social/pinterest/5-london-neighbourhoods-pin.svg', w: 1000, h: 1500 },
];

let generated = 0;
for (const { src, w, h } of TARGETS) {
  const srcPath = path.join(REPO, src);
  const dstPath = srcPath.replace(/\.svg$/, '.png');
  const svg = fs.readFileSync(srcPath);
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: w },
    background: '#FAF7F0',
    font: { loadSystemFonts: true },
  });
  const png = resvg.render().asPng();
  fs.writeFileSync(dstPath, png);
  console.log(`  ${src}  ->  ${path.relative(REPO, dstPath)}  (${w}x${h})`);
  generated++;
}

console.log(`\nGenerated ${generated} PNG(s).`);
