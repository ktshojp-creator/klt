import fs from 'fs';

async function main() {
  const url = 'https://manus.im/share/file/3bf7586f-d32b-4543-bcd8-313789d462cc';
  const response = await fetch(url);
  const text = await response.text();
  
  // Save the raw text to check
  fs.writeFileSync('raw_manus.html', text);
  console.log('Saved raw HTML. Length:', text.length);

  // Search for typical Next.js data scripts
  const nextDataRegex = /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/;
  const match = text.match(nextDataRegex);
  if (match) {
    console.log('Found __NEXT_DATA__!');
    fs.writeFileSync('next_data.json', match[1]);
  } else {
    console.log('__NEXT_DATA__ not found.');
  }

  // Also check for self.__next_f.push scripts
  const selfNextRegex = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
  let m;
  const pushes = [];
  while ((m = selfNextRegex.exec(text)) !== null) {
    pushes.push(m[1]);
  }
  if (pushes.length > 0) {
    console.log(`Found ${pushes.length} self.__next_f.push entries.`);
    fs.writeFileSync('pushes.txt', pushes.join('\n'));
  }

  // Look for any other script block containing "props" or data
  const scripts = [];
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
  while ((m = scriptRegex.exec(text)) !== null) {
    const s = m[1];
    if (s.includes('3bf7586f') || s.includes('title') || s.includes('content') || s.includes('file')) {
      scripts.push(s);
    }
  }
  if (scripts.length > 0) {
    console.log(`Found ${scripts.length} interesting script blocks.`);
    fs.writeFileSync('interesting_scripts.txt', scripts.join('\n\n---SCRIPT---\n\n'));
  }
}

main().catch(console.error);
