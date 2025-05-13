#!/bin/bash

# Script to prepare the repository for Render.com deployment

echo "Preparing repository for Render.com deployment..."

# Ensure frontend API config files exist
mkdir -p frontend/public
cp -f frontend/public/api-config.production.js frontend/public/api-config.js || {
  echo "Creating api-config.js from scratch"
  cat > frontend/public/api-config.js << EOF
window.API_CONFIG = {
  API_URL: "https://cosmo-stats-backend.onrender.com",
  ENVIRONMENT: "production"
};
EOF

  cat > frontend/public/api-config.production.js << EOF
window.API_CONFIG = {
  API_URL: "https://cosmo-stats-backend.onrender.com",
  ENVIRONMENT: "production"
};
EOF
}

# Ensure frontend has index.html (copy from template if missing)
if [ ! -f frontend/public/index.html ]; then
  echo "Creating index.html from template"
  cat > frontend/public/index.html << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.svg" type="image/svg+xml" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="COSMO RLT Statistics Dashboard"
    />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <script src="%PUBLIC_URL%/api-config.js"></script>
    <title>COSMO-STATS</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF
fi

# Ensure manifest.json exists
if [ ! -f frontend/public/manifest.json ]; then
  echo "Creating manifest.json"
  cat > frontend/public/manifest.json << EOF
{
  "short_name": "COSMO Stats",
  "name": "COSMO RLT Statistics Dashboard",
  "icons": [
    {
      "src": "favicon.svg",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/svg+xml"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
EOF
fi

# Ensure favicon.svg exists
if [ ! -f frontend/public/favicon.svg ]; then
  echo "Creating favicon.svg"
  cat > frontend/public/favicon.svg << EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#336699" />
  <text x="50%" y="50%" font-family="Arial" font-size="50" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">C</text>
</svg>
EOF
fi

# Ensure images directory exists
mkdir -p frontend/public/images

# Make a note to commit these files
echo "✅ Repository prepared for Render.com deployment"
echo ""
echo "IMPORTANT: Commit the following files to your repository:"
echo "  - frontend/public/api-config.js"
echo "  - frontend/public/api-config.production.js"
echo "  - frontend/public/index.html"
echo "  - frontend/public/manifest.json"
echo "  - frontend/public/favicon.svg"
echo "  - render.yaml"
echo ""
echo "Run this command to add them:"
echo "git add frontend/public/ render.yaml && git commit -m \"Add required files for Render.com deployment\"" 