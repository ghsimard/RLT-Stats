// This file is a runtime wrapper to load TypeScript files
// It's used when TypeScript compilation fails but the code is still runnable

try {
  // Try to load ts-node dynamically
  require('ts-node').register({
    transpileOnly: true, // Skip type checking
    compilerOptions: {
      module: 'commonjs',
      esModuleInterop: true
    }
  });
  
  // Now require the TypeScript file directly
  require('./server.ts');
  
  console.log('Successfully loaded server.ts via ts-node');
} catch (error) {
  console.error('Error loading server.ts:', error);
  process.exit(1);
} 