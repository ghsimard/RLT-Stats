#!/bin/bash

# Script to switch between development and production environments

if [ "$1" == "prod" ] || [ "$1" == "production" ]; then
  echo "Switching to production environment..."
  
  # Copy production API config
  cp frontend/public/api-config.production.js frontend/public/api-config.js
  echo "✅ Frontend API config set to production"
  
  # Copy production environment file
  cp env.production backend/.env
  echo "✅ Backend environment set to production"
  
  echo "✨ Environment is now set to PRODUCTION"
  
elif [ "$1" == "dev" ] || [ "$1" == "development" ]; then
  echo "Switching to development environment..."
  
  # Copy development API config
  cp frontend/public/api-config.development.js frontend/public/api-config.js
  echo "✅ Frontend API config set to development"
  
  # Copy development environment file
  cp env.development backend/.env
  echo "✅ Backend environment set to development"
  
  echo "✨ Environment is now set to DEVELOPMENT"
  
else
  echo "❌ Invalid option. Usage: ./env-switch.sh [dev|prod]"
  echo "   dev, development: Switch to development environment"
  echo "   prod, production: Switch to production environment"
  exit 1
fi 