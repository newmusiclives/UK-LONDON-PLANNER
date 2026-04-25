#!/bin/bash
# scripts/svg-to-png.sh
# Convert the social-creative SVGs in images/social/ to PNG at the
# right pixel dimensions for Instagram (1080x1080) and Pinterest (1000x1500).
# Tries rsvg-convert first, then ImageMagick (magick / convert).
#
# Install: `brew install librsvg` (preferred) or `brew install imagemagick`

set -euo pipefail

cd "$(dirname "$0")/.."

SVGS=(
  "images/social/instagram/01-marylebone.svg:1080:1080"
  "images/social/instagram/02-spitalfields.svg:1080:1080"
  "images/social/instagram/03-notting-hill.svg:1080:1080"
  "images/social/instagram/04-bloomsbury.svg:1080:1080"
  "images/social/instagram/05-bermondsey.svg:1080:1080"
  "images/social/pinterest/5-london-neighbourhoods-pin.svg:1000:1500"
)

if command -v rsvg-convert >/dev/null 2>&1; then
  TOOL="rsvg-convert"
elif command -v magick >/dev/null 2>&1; then
  TOOL="magick"
elif command -v convert >/dev/null 2>&1; then
  TOOL="convert"
else
  echo "ERROR: no SVG converter found." >&2
  echo "  Install one with:  brew install librsvg" >&2
  echo "                  or brew install imagemagick" >&2
  exit 1
fi

echo "Converter: $TOOL"

for entry in "${SVGS[@]}"; do
  IFS=':' read -r src w h <<< "$entry"
  dst="${src%.svg}.png"
  echo "  $src  ->  $dst  (${w}x${h})"
  case "$TOOL" in
    rsvg-convert) rsvg-convert -w "$w" -h "$h" "$src" -o "$dst" ;;
    magick)       magick -background "#FAF7F0" -density 300 "$src" -resize "${w}x${h}" "$dst" ;;
    convert)      convert -background "#FAF7F0" -density 300 "$src" -resize "${w}x${h}" "$dst" ;;
  esac
done

echo
echo "Generated:"
ls -la images/social/instagram/*.png images/social/pinterest/*.png
