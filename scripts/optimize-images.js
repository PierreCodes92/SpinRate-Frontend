/**
 * Image Optimization Script
 * Run with: node scripts/optimize-images.js
 * 
 * Prerequisites: npm install sharp --save-dev
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for images to optimize
const imagesToOptimize = [
  {
    input: 'public/lovable-uploads/revwheel-logo.webp',
    outputs: [
      { suffix: '-sm', width: 120, height: 48 },   // 1x for header
      { suffix: '-md', width: 240, height: 96 },   // 2x for header (retina)
    ]
  },
  {
    input: 'src/assets/uk.webp',
    outputs: [
      { suffix: '-sm', width: 32, height: 32 },    // 1x
      { suffix: '-md', width: 64, height: 64 },    // 2x (retina)
    ]
  },
  {
    input: 'src/assets/france.webp',
    outputs: [
      { suffix: '-sm', width: 32, height: 32 },    // 1x
      { suffix: '-md', width: 64, height: 64 },    // 2x (retina)
    ]
  }
];

async function optimizeImage(config) {
  const projectRoot = path.resolve(__dirname, '..');
  const inputPath = path.resolve(projectRoot, config.input);
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  const dirName = path.dirname(inputPath);

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${config.input} - file not found`);
    return;
  }

  console.log(`\n📸 Optimizing: ${config.input}`);

  for (const output of config.outputs) {
    const outputName = `${baseName}${output.suffix}${ext}`;
    const outputPath = path.join(dirName, outputName);

    try {
      await sharp(inputPath)
        .resize(output.width, output.height, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .webp({ quality: 85 })
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      console.log(`   ✅ Created: ${outputName} (${(stats.size / 1024).toFixed(1)} KB)`);
    } catch (error) {
      console.log(`   ❌ Error creating ${outputName}:`, error.message);
    }
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script');
  console.log('============================\n');

  for (const config of imagesToOptimize) {
    await optimizeImage(config);
  }

  console.log('\n✨ Done! Update your components to use the optimized images.');
  console.log('\nExample usage:');
  console.log('  <img');
  console.log('    src="/lovable-uploads/revwheel-logo-sm.webp"');
  console.log('    srcSet="/lovable-uploads/revwheel-logo-sm.webp 1x, /lovable-uploads/revwheel-logo-md.webp 2x"');
  console.log('    alt="RevWheel logo"');
  console.log('  />');
}

main().catch(console.error);

