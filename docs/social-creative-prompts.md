# Social Creative — Midjourney Prompts + Typography Placeholder Guide

## Where the assets live

- **Typography placeholders:** `images/social/instagram/01-marylebone.svg` … `05-bermondsey.svg`, plus `images/social/pinterest/5-london-neighbourhoods-pin.svg`. Use these now while photography is sourced.
- **PNG conversion** (Instagram + Pinterest don't accept SVG): one of:
  - `rsvg-convert -w 1080 -h 1080 input.svg > output.png` (install with `brew install librsvg`)
  - `magick input.svg -resize 1080x1080 output.png` (ImageMagick)
  - Open the SVG in any browser → "Save as image"

The IG carousel needs five 1080×1080 PNGs in slide order; the Pinterest pin needs one 1000×1500 PNG.

---

## Midjourney v6 prompts — photography version

Use these when you're ready to swap the typography placeholders for real London photography. All prompts target moody, no-people, late-spring natural light.

### Instagram carousel (1:1, --ar 1:1)

**Slide 1 — Marylebone**
```
A narrow Marylebone mews lane in central London at dawn, gas-style street lamps still glowing, smooth cobblestones, ivy on Georgian brick walls, soft golden light, no people, calm, editorial travel photography, shallow depth of field, Fujifilm 35mm, --ar 1:1 --style raw --v 6
```

**Slide 2 — Spitalfields**
```
A worn brick lane in Spitalfields London, vintage shop fronts, hand-painted signage, weathered timber doors, late spring afternoon light, no people, layered textures, editorial travel photography, Fujifilm 35mm, --ar 1:1 --style raw --v 6
```

**Slide 3 — Notting Hill**
```
A winding Notting Hill street in London, pastel-painted Victorian terraces in soft pinks and blues, leafy trees, late spring afternoon, no people, gentle perspective, editorial travel photography, Fujifilm 35mm, --ar 1:1 --style raw --v 6
```

**Slide 4 — Bloomsbury**
```
A wrought-iron garden gate in Bloomsbury London, glimpse of a quiet literary square beyond, dappled spring light through plane trees, no people, contemplative mood, editorial travel photography, Fujifilm 35mm, --ar 1:1 --style raw --v 6
```

**Slide 5 — Bermondsey**
```
A cobbled riverside lane in Bermondsey London at golden hour, faint glimpse of the Thames, weathered warehouse brick, soft warm light, no people, timeless feel, editorial travel photography, Fujifilm 35mm, --ar 1:1 --style raw --v 6
```

### Pinterest pin (2:3, --ar 2:3)

```
A tall vertical photograph of a Marylebone mews lane in London at early morning, gas lamps softly lit, cobblestones, Georgian brick, leading lines drawing the eye down the lane, late spring light, no people, editorial travel photography for a guidebook cover, Fujifilm 35mm, --ar 2:3 --style raw --v 6
```

---

## Stock alternative

If Midjourney isn't preferred, the same scenes are well-covered on Unsplash and Pexels:

- "Marylebone mews" / "London mews"
- "Spitalfields street"
- "Notting Hill street pastel"
- "Bloomsbury garden square"
- "Bermondsey Thames"

License: prefer Unsplash + Pexels (free, no attribution required for commercial).

---

## When real photography lands

1. Drop PNG/JPG into `images/social/instagram/01-marylebone.png` etc. (replacing the SVGs in name)
2. In `ai-staff/social-publisher.js`, extend `payload` with a `media: [{ url, type }]` array per platform
3. Flip `enabled: true` for `instagram` and `pinterest` in `ai-staff/social-schedule.json`
4. Restart the review server
