import fs from 'fs';

async function main() {
  const html = fs.readFileSync('raw_manus.html', 'utf8');
  
  // Extract script src URLs
  const srcRegex = /src="(https:\/\/files\.manuscdn\.com\/[^\s"<>]+)"/g;
  let match;
  const urls = [];
  while ((match = srcRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  
  console.log(`Found ${urls.length} script URLs.`);
  
  for (const url of urls) {
    console.log(`Downloading ${url}...`);
    try {
      const res = await fetch(url);
      const text = await res.text();
      
      const filename = url.split('/').pop();
      fs.writeFileSync(filename, text);
      
      // Let's search inside this text
      const matchesShare = text.match(/\/share[a-zA-Z0-9_/]*/g) || [];
      const matchesApi = text.match(/\/api\/[a-zA-Z0-9_/]*/g) || [];
      const matchesRpc = text.match(/rpc[a-zA-Z0-9_/]*/gi) || [];
      
      if (matchesShare.length > 0 || matchesApi.length > 0 || matchesRpc.length > 0) {
        console.log(`- File ${filename}:`);
        if (matchesShare.length > 0) console.log(`  Share paths:`, Array.from(new Set(matchesShare)).slice(0, 5));
        if (matchesApi.length > 0) console.log(`  API paths:`, Array.from(new Set(matchesApi)).slice(0, 5));
        if (matchesRpc.length > 0) console.log(`  RPC matches:`, Array.from(new Set(matchesRpc)).slice(0, 5));
      }
    } catch (err) {
      console.error(`Error downloading ${url}:`, err.message);
    }
    console.log('-'.repeat(40));
  }
}

main().catch(console.error);
