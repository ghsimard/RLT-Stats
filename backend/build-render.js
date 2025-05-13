/**
 * Custom build script for Render deployment
 * This script skips TypeScript compilation and copies files directly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const imagesDir = path.join(distDir, 'images');
const pdfOutputDir = path.join(distDir, 'pdf-output');
const pdfModulesDir = path.join(distDir, 'pdf-modules');
const frontendImagesDir = path.join(__dirname, '..', 'frontend', 'public', 'images');

console.log('Starting custom build for Render deployment...');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  console.log(`Creating dist directory: ${distDir}`);
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy all files from src to dist
console.log('Copying source files to dist...');
execSync(`cp -r ${srcDir}/* ${distDir}/`);

// Create necessary directories
console.log('Creating necessary directories...');
fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(pdfOutputDir, { recursive: true });
fs.mkdirSync(pdfModulesDir, { recursive: true });

// Copy frontend images to dist/images
if (fs.existsSync(frontendImagesDir)) {
  console.log('Copying frontend images...');
  execSync(`cp -R ${frontendImagesDir}/* ${imagesDir}/`);
}

// Copy pdfHelpers.js if it exists
const pdfHelpersSource = path.join(srcDir, 'pdf-modules', 'pdfHelpers.js');
const pdfHelpersDest = path.join(pdfModulesDir, 'pdfHelpers.js');
if (fs.existsSync(pdfHelpersSource)) {
  console.log('Copying pdfHelpers.js...');
  fs.copyFileSync(pdfHelpersSource, pdfHelpersDest);
}

console.log('Custom build completed successfully!'); 