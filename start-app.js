const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log(' Starting iPhone Shop Application');
console.log(' 1. GraphQL API Server: http://localhost:3001/graphql');
console.log(' 2. React Frontend:     http://localhost:3000');
console.log('====================================================\n');

// 1. Start Backend Server
const serverProcess = spawn('node', [path.join(__dirname, 'iphone-shop-api', 'server.js')], {
  stdio: 'inherit',
  shell: true,
});

// 2. Start Frontend Dev Server
// On Windows, use npm.cmd
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const frontendProcess = spawn(npmCmd, ['start'], {
  cwd: path.join(__dirname, 'iphone-shop-frontend'),
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PORT: '3000',
    BROWSER: 'none', // Prevent auto-opening duplicate tabs during automated runs
  },
});

function shutdown() {
  console.log('\nShutting down iPhone Shop Application...');
  serverProcess.kill();
  frontendProcess.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

serverProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Backend server exited with code ${code}`);
  }
});

frontendProcess.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Frontend exited with code ${code}`);
  }
});
