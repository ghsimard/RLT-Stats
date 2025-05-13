// Production server.js - will run the TypeScript files directly
console.log('Starting server in production mode');

try {
  // First try to load the compiled JavaScript if it exists
  const serverPath = './server.js';
  console.log(`Attempting to load compiled JavaScript: ${serverPath}`);
  require(serverPath);
} catch (jsError) {
  console.warn('Failed to load compiled JavaScript, falling back to TypeScript:', jsError.message);
  
  try {
    // Install ts-node and register it
    console.log('Loading ts-node to transpile TypeScript files');
    require('ts-node').register({
      transpileOnly: true, // Skip type checking
      compilerOptions: {
        module: 'commonjs',
        esModuleInterop: true,
        skipLibCheck: true
      }
    });
    
    // Now load the TypeScript file
    console.log('Loading TypeScript server file');
    require('./server.ts');
    console.log('Successfully loaded server through ts-node');
  } catch (tsError) {
    console.error('Failed to load server through ts-node:', tsError);
    process.exit(1);
  }
}
