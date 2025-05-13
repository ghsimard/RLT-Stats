const fs = require('fs');
const path = require('path');

// Function to create a simple colored rectangle with text as a Buffer
function createImageBuffer(width, height, color, text) {
  // Very simple SVG that will be readable as both JPEG and PNG
  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="16" fill="white" 
      text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>
  `;
  return Buffer.from(svg);
}

// Create directory if it doesn't exist
const imagesDir = path.join(__dirname);
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create RLT logo (blue rectangle with text)
const rltBuffer = createImageBuffer(180, 100, "#336699", "RLT Logo");
fs.writeFileSync(path.join(imagesDir, "RLT_logo.jpeg"), rltBuffer);
console.log("Created RLT logo");

// Create CLT logo (green rectangle with text)
const cltBuffer = createImageBuffer(180, 100, "#339966", "CLT Logo");
fs.writeFileSync(path.join(imagesDir, "CLT_logo.jpeg"), cltBuffer);
console.log("Created CLT logo");

// Create CosmoStats logo (orange rectangle with text)
const cosmoBuffer = createImageBuffer(150, 50, "#FF6600", "CosmoStats");
fs.writeFileSync(path.join(imagesDir, "LogoCosmo.png"), cosmoBuffer);
console.log("Created CosmoStats logo");

console.log("All images created successfully!"); 