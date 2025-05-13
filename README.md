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

#### Backend Deployment

1. Create a new Web Service on Render
   - Connect to your GitHub repository
   - Set the build command: `npm install && npm run build`
   - Set the start command: `NODE_ENV=production npm start`
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
   - Add the following environment variables if needed:
     - `NODE_ENV`: `production`

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
