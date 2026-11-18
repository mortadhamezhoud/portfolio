// Generates optimized profile images from public/img (run: npm run images)
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const jobs = [
  { src: "public/img/img_morta.jpg", out: "public/images/profile.webp" },
  { src: "public/img/img_morta_cutout.png", out: "public/images/profile-cutout.webp" },
];

await mkdir("public/images", { recursive: true });

for (const { src, out } of jobs) {
  if (!existsSync(src)) {
    console.log(`skip  ${src} (not found)`);
    continue;
  }
  const info = await sharp(src)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 90 })
    .toFile(out);
  console.log(`wrote ${out} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
}
