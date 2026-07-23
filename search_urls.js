import fs from 'fs';

function main() {
  const content = fs.readFileSync('raw_manus.html', 'utf8');
  
  // Find all URLs or API calls
  const urlRegex = /https?:\/\/[^\s"'`<>]+/g;
  const urls = Array.from(new Set(content.match(urlRegex) || []));
  
  console.log('URLs found in HTML:');
  urls.forEach(u => {
    if (u.includes('manus') || u.includes('api') || u.includes('cdn')) {
      console.log('-', u);
    }
  });
  
  // Search for interesting JSON keys or words
  const searchWords = ['prompt', 'korean', 'travel', 'session', 'file', 'content', 'data'];
  searchWords.forEach(word => {
    const count = (content.match(new RegExp(word, 'gi')) || []).length;
    console.log(`Word "${word}" count:`, count);
  });
}

main();
