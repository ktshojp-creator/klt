import fs from 'fs';

function main() {
  const files = fs.readdirSync('.');
  const jsFiles = files.filter(f => f.endsWith('.js'));
  console.log(`Scanning ${jsFiles.length} JS files for Service methods...`);

  const results = [];
  jsFiles.forEach(file => {
    const text = fs.readFileSync(file, 'utf8');
    
    // Scan for strings resembling "ServiceName/MethodName" or "ServiceName.MethodName"
    // Connect/gRPC often uses /package.Service/Method or Service/Method or Service.Method
    // Let's find patterns like /[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+/ or similar
    const rpcMatches = text.match(/"[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+"/g) || [];
    rpcMatches.forEach(m => {
      const clean = m.replace(/"/g, '');
      if (clean.includes('Service') || clean.includes('Share') || clean.includes('File') || clean.includes('Session') || clean.includes('Query')) {
        results.push({ file, rpc: clean });
      }
    });

    const rpcSlashMatches = text.match(/"\/[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+\/[a-zA-Z0-9_]+"/g) || [];
    rpcSlashMatches.forEach(m => {
      results.push({ file, rpc: m.replace(/"/g, '') });
    });
  });

  const unique = Array.from(new Set(results.map(r => r.rpc)));
  console.log('Found unique RPC strings:', unique);
}

main();
