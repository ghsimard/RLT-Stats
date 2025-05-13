# COSMO Stats Application

Statistical analysis and reporting tool for COSMO RLT educational program.

## Environment Setup

This application supports both development and production environments.

### Local Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cosmoStats.git
   cd cosmoStats
   ```

2. Install dependencies:
   ```
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Switch to development environment:
   ```
   ./env-switch.sh dev
   ```

4. Start the backend:
   ```
   cd backend && npm run dev
   ```

5. Start the frontend (in a new terminal):
   ```
   cd frontend && npm start
   ```

6. Access the application at http://localhost:4000

### Production Environment Setup (Render.com)

#### Preparing Repository for Render.com

Before deploying to Render.com, make sure your repository contains all necessary files:

1. Run the preparation script:
   ```
   ./prepare-for-render.sh
   ```

2. Commit all generated files to your repository:
   ```
   git add frontend/public/ render.yaml
   git commit -m "Add required files for Render.com deployment"
   git push
   ```

#### Backend Deployment

1. Create a new Web Service on Render
   - Connect to your GitHub repository
   - Set the build command: `cd backend && npm install && npm run build`
   - Set the start command: `cd backend && NODE_ENV=production node dist/server.js`
   - Add the following environment variables:
     - `DB_CONNECTION_STRING`: `postgresql://cosmo_rlt_user:BpG7RWIjipwdYQMKjXYRua4TcpYffwPL@dpg-d054t79r0fns73d2loeg-a/cosmo_rlt`
     - `PORT`: `4001`
     - `NODE_ENV`: `production`
     - `CORS_ORIGINS`: `https://cosmo-stats-frontend.onrender.com`

#### Frontend Deployment

1. Create a new Static Site on Render
   - Connect to your GitHub repository
   - Set the build command: `cd frontend && npm install && npm run build`
   - Set the publish directory: `frontend/build`

#### Using Blueprint (Recommended)

The easiest way to deploy is using the Render Blueprint:

1. Make sure render.yaml exists at the root of your repository
2. Run the prepare-for-render.sh script to ensure all necessary files exist
3. Commit and push all changes to GitHub
4. Create a new Blueprint deployment in Render.com, pointing to your repository
5. Render will automatically set up both services according to the render.yaml configuration

## Project Structure

- `frontend/`: React frontend application
  - `public/`: Static assets and configuration
  - `src/`: Source code
    - `components/`: React components
    - `services/`: API service calls
    - `types/`: TypeScript type definitions

- `backend/`: Express backend application
  - `src/`: Source code
    - `pdf-modules/`: PDF generation code
    - `config.ts`: Application configuration
    - `db.ts`: Database connection
    - `server.ts`: Main server code

## Configuration

The application uses different configuration files for development and production:

### Frontend
- `public/api-config.development.js`: Development API configuration
- `public/api-config.production.js`: Production API configuration

### Backend
- `.env.development`: Development environment variables
- `.env.production`: Production environment variables

## Switching Environments

Use the provided script to switch between environments:

```
./env-switch.sh dev    # Switch to development
./env-switch.sh prod   # Switch to production
```

## Troubleshooting Render.com Deployment

If you encounter issues with deployment on Render.com:

1. Check that all required files are in your GitHub repository:
   - frontend/public/index.html
   - frontend/public/api-config.js
   - frontend/public/api-config.production.js
   - frontend/public/manifest.json
   - frontend/public/favicon.svg

2. Verify your render.yaml file is at the root of the repository

3. Make sure the build commands in render.yaml match your project structure

4. Check the build logs for any specific errors
