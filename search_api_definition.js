import fs from 'fs';
import path from 'path';

function main() {
  const files = fs.readdirSync('.');
  const jsFiles = files.filter(f => f.endsWith('.js'));
  console.log(`Scanning ${jsFiles.length} JS files...`);

  jsFiles.forEach(file => {
    const text = fs.readFileSync(file, 'utf8');
    
    // Let's search for "v1" or "v2" or "share" or "api" combined
    // Or let's find any string starting with /api/
    const apiRegex = /\/api\/v\d\/[a-zA-Z0-9_/:-]+/g;
    const apiMatches = Array.from(new Set(text.match(apiRegex) || []));
    if (apiMatches.length > 0) {
      console.log(`File ${file} has API matches:`, apiMatches);
    }

    // Let's search for any string that contains "share" and "file" or similar
    const shareRegex = /"\/[^"]*share[^"]*"/gi;
    const shareMatches = Array.from(new Set(text.match(shareRegex) || []));
    if (shareMatches.length > 0) {
      console.log(`File ${file} has share matches:`, shareMatches);
    }

    // Search for "rpc"
    if (text.includes('rpc') || text.includes('Rpc') || text.includes('RPC')) {
      // Find the method names or strings
      const rpcMethods = text.match(/"[a-zA-Z0-9]+\.[a-zA-Z0-9]+"/g) || [];
      if (rpcMatchesCount(text) > 0) {
        console.log(`File ${file} has rpc references. Found ${rpcMethods.length} rpc method strings like:`, rpcMethods.slice(0, 5));
      }
    }
  });
}

function rpcMatchesCount(text) {
  return (text.match(/rpc/gi) || []).length;
}

main();
