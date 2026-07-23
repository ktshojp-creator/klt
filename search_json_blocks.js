import fs from 'fs';

function main() {
  const content = fs.readFileSync('raw_manus.html', 'utf8');
  
  // Find all JSON blocks in script tags
  const regex = /<script[^>]*>([\s\S]*?)<\/script>/g;
  let match;
  let scriptIndex = 0;
  
  while ((match = regex.exec(content)) !== null) {
    scriptIndex++;
    const scriptText = match[1];
    
    // Check if it looks like JSON or contains JSON
    const jsonMatch = scriptText.match(/({[\s\S]*})/);
    if (jsonMatch) {
      const jsonText = jsonMatch[1];
      if (jsonText.length > 200 && (jsonText.includes('share') || jsonText.includes('file') || jsonText.includes('korean'))) {
        console.log(`--- Script ${scriptIndex} (Length: ${scriptText.length}) ---`);
        console.log(jsonText.slice(0, 1000));
        fs.writeFileSync(`json_block_${scriptIndex}.json`, jsonText);
      }
    }
  }
}

main();
