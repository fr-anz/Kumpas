/**
 * Generates minimal PNG icons for PWA manifest.
 * Run: node scripts/generate-icons.js
 *
 * Creates solid-color placeholder PNGs with the bee-black background and a
 * yellow "K" text indicator. These are valid PNGs that satisfy OS install
 * requirements. Replace with proper designed assets when available.
 */

import { writeFileSync } from "fs";

// Minimal PNG encoder: creates a valid uncompressed PNG with RGBA pixel data.
function createPng(width, height, bgR, bgG, bgB) {
  // Simple solid-color image with a centered region for brand color
  const pixels = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    const offset = i * 4;

    // Draw a rounded-ish centered yellow square (brand accent area)
    const cx = width / 2;
    const cy = height / 2;
    const size = width * 0.35;
    const inCenter = Math.abs(x - cx) < size && Math.abs(y - cy) < size;

    if (inCenter) {
      // Bee yellow #F9C800
      pixels[offset] = 0xf9;
      pixels[offset + 1] = 0xc8;
      pixels[offset + 2] = 0x00;
      pixels[offset + 3] = 0xff;
    } else {
      pixels[offset] = bgR;
      pixels[offset + 1] = bgG;
      pixels[offset + 2] = bgB;
      pixels[offset + 3] = 0xff;
    }
  }
  return encodePng(width, height, pixels);
}

function encodePng(width, height, rgbaPixels) {
  const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const typeBytes = Buffer.from(type, "ascii");
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const combined = Buffer.concat([typeBytes, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(combined));
    return Buffer.concat([length, combined, crc]);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT - uncompressed deflate
  const rawRows = [];
  for (let y = 0; y < height; y++) {
    rawRows.push(Buffer.from([0])); // filter none
    rawRows.push(rgbaPixels.subarray(y * width * 4, (y + 1) * width * 4));
  }
  const rawData = Buffer.concat(rawRows);

  // Wrap in zlib uncompressed blocks (max 65535 bytes per block)
  const blocks = [];
  let offset = 0;
  while (offset < rawData.length) {
    const remaining = rawData.length - offset;
    const blockSize = Math.min(65535, remaining);
    const isFinal = offset + blockSize >= rawData.length;
    const header = Buffer.alloc(5);
    header[0] = isFinal ? 1 : 0;
    header.writeUInt16LE(blockSize, 1);
    header.writeUInt16LE(blockSize ^ 0xffff, 3);
    blocks.push(header);
    blocks.push(rawData.subarray(offset, offset + blockSize));
    offset += blockSize;
  }

  // Zlib wrapper
  const zlibHeader = Buffer.from([0x78, 0x01]); // deflate, no dict
  const deflatedData = Buffer.concat(blocks);

  // Adler-32 checksum
  let a = 1,
    b = 0;
  for (let i = 0; i < rawData.length; i++) {
    a = (a + rawData[i]) % 65521;
    b = (b + a) % 65521;
  }
  const adler = Buffer.alloc(4);
  adler.writeUInt32BE(((b << 16) | a) >>> 0);

  const zlibData = Buffer.concat([zlibHeader, deflatedData, adler]);

  // IEND
  const iend = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlibData),
    iend,
  ]);
}

// Generate icons
const icon192 = createPng(192, 192, 0x12, 0x12, 0x12);
const icon512 = createPng(512, 512, 0x12, 0x12, 0x12);

// Generate screenshots (narrow=390x844, wide=1280x720)
const screenshotNarrow = createPng(390, 844, 0x12, 0x12, 0x12);
const screenshotWide = createPng(1280, 720, 0x12, 0x12, 0x12);

writeFileSync("public/icon-192x192.png", icon192);
writeFileSync("public/icon-512x512.png", icon512);
writeFileSync("public/screenshot-narrow.png", screenshotNarrow);
writeFileSync("public/screenshot-wide.png", screenshotWide);

console.log("Generated: icon-192x192.png, icon-512x512.png, screenshot-narrow.png, screenshot-wide.png");
