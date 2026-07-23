import fs from 'fs';

async function main() {
  const url = 'https://files.manuscdn.com/webapp/_next/static/chunks/app/share/file/%5BfileShareId%5D/page-5f0db550bf6b7ede.js';
  const response = await fetch(url);
  const text = await response.text();
  
  fs.writeFileSync('page_js.js', text);
  console.log('Downloaded JS. Length:', text.length);

  // Search for URLs, api endpoints, fetch requests, paths, etc.
  // Look for any string starting with slash like "/api/..." or containing "share"
  const paths = text.match(/"\/[^"]+"/g) || [];
  console.log('Found double quoted paths:', paths.slice(0, 50));
  
  const singlePaths = text.match(/'\/[^']+'/g) || [];
  console.log('Found single quoted paths:', singlePaths.slice(0, 50));

  // Search for "api" or "share" or "file" related strings
  const words = ['api', 'share', 'file', 'fetch', 'v1', 'v2', 'get', 'post'];
  words.forEach(w => {
    const regex = new RegExp(`.{0,50}${w}.{0,50}`, 'gi');
    const matches = text.match(regex) || [];
    console.log(`Word "${w}" match count:`, matches.length);
    if (matches.length > 0) {
      console.log(`Preview matches for "${w}":`, matches.slice(0, 5));
    }
  });
}

main().catch(console.error);
