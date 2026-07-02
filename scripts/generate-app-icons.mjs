/**
 * Generate proper PWA app icons from the real Kumpas logo (kumpas_logo.svg).
 *
 * Produces:
 *   icon-192x192.png        transparent, logo fills frame ("any" purpose)
 *   icon-512x512.png        transparent, logo fills frame ("any" purpose)
 *   icon-192-maskable.png   logo on solid bg with safe-zone padding (maskable)
 *   icon-512-maskable.png   logo on solid bg with safe-zone padding (maskable)
 *   apple-touch-icon.png    180x180 on solid bg (iOS has no transparency)
 *
 * Maskable icons are cropped by the OS to a circle/squircle, so the logo must
 * sit inside a ~80% safe zone with a background, or it gets clipped.
 *
 * Run: node scripts/generate-app-icons.mjs
 */
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, "..", "public");
const LOGO = join(pub, "kumpas_logo.svg");

// Brand background for maskable / iOS icons (cream surface reads well with the
// logo and matches the manifest background_color).
const BG = { r: 0xff, g: 0xf8, b: 0xe1, alpha: 1 };

const svg = readFileSync(LOGO);

/** Full-bleed transparent icon: logo scaled to fill the square. */
async function anyIcon(size, out) {
  const logo = await sharp(svg)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp(logo).toFile(join(pub, out));
}

/** Maskable icon: solid bg + logo at ~76% inside the safe zone. */
async function maskableIcon(size, out) {
  const inner = Math.round(size * 0.76);
  const logo = await sharp(svg)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const pad = Math.round((size - inner) / 2);
  await sharp({
    create: { width: size, height: size, channels: 4, background: BG },
  })
    .composite([{ input: logo, top: pad, left: pad }])
    .png()
    .toFile(join(pub, out));
}

async function appleIcon(size, out) {
  const inner = Math.round(size * 0.82);
  const logo = await sharp(svg)
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const pad = Math.round((size - inner) / 2);
  await sharp({
    create: { width: size, height: size, channels: 4, background: BG },
  })
    .composite([{ input: logo, top: pad, left: pad }])
    .png()
    .toFile(join(pub, out));
}

await anyIcon(192, "icon-192x192.png");
await anyIcon(512, "icon-512x512.png");
await maskableIcon(192, "icon-192-maskable.png");
await maskableIcon(512, "icon-512-maskable.png");
await appleIcon(180, "apple-touch-icon.png");

console.log("Generated app icons from kumpas_logo.svg");
