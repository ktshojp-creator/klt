import fs from 'fs';

function main() {
  const content = fs.readFileSync('parsed_pushes.txt', 'utf8');
  
  // Let's find any string that is quite long (e.g., > 100 chars)
  // or contains interesting words.
  // We can also parse JSON blocks inside this text.
  
  // Next.js RSC payload contains things like:
  // id:JSON
  // e.g. 1a:{"some":"json"}
  
  const entries = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().length === 0) continue;
    
    // Look for patterns like "id:json"
    const match = line.match(/^([a-f0-9]+):(.*)$/i);
    if (match) {
      const id = match[1];
      const data = match[2];
      entries.push({ id, data, length: data.length });
    } else {
      entries.push({ id: 'none', data: line, length: line.length });
    }
  }
  
  // Sort entries by length descending
  entries.sort((a, b) => b.length - a.length);
  
  console.log('Total entries found:', entries.length);
  console.log('Top 10 longest entries:');
  for (let i = 0; i < Math.min(10, entries.length); i++) {
    const e = entries[i];
    console.log(`- ID: ${e.id}, Length: ${e.length}, Preview: ${e.data.slice(0, 150)}`);
  }
  
  // Let's write all entries sorted by length to a file
  const output = entries.map(e => `ID: ${e.id}\nLength: ${e.length}\nData: ${e.data}\n${'='.repeat(40)}`).join('\n\n');
  fs.writeFileSync('sorted_entries.txt', output);
}

main();
