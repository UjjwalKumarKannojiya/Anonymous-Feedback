import { networkInterfaces } from 'os';
import { spawn } from 'child_process';

// Get local IP address
const nets = networkInterfaces();
let localIp = 'localhost';

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    if (net.family === 'IPv4' && !net.internal) {
      localIp = net.address;
      // We break on the first external IPv4 address we find
      break;
    }
  }
}

const url = `http://${localIp}:3000`;
console.log(`\n======================================================`);
console.log(`🚀 Starting local server...`);
console.log(`🌐 Automatically setting NEXTAUTH_URL to: ${url}`);
console.log(`======================================================\n`);

// Merge existing environment variables with the newly generated NEXTAUTH_URL
const env = { ...process.env, NEXTAUTH_URL: url };

// Spawn the next dev server
const next = spawn('npx', ['next', 'dev', '-H', '0.0.0.0'], { 
    env, 
    stdio: 'inherit',
    shell: true 
});

next.on('close', (code) => {
  process.exit(code);
});
