import fs from 'fs';

function main() {
  const content = fs.readFileSync('raw_manus.html', 'utf8');
  
  // Let's find all script blocks with self.__next_f.push
  const regex = /self\.__next_f\.push\(\[1,"([\s\S]*?)"\]\)/g;
  let match;
  let allPushes = '';
  
  while ((match = regex.exec(content)) !== null) {
    let piece = match[1];
    // Unescape the string if it contains escaped characters
    // Next.js escapes quotes, backslashes, etc.
    piece = piece.replace(/\\"/g, '"')
                 .replace(/\\n/g, '\n')
                 .replace(/\\r/g, '\r')
                 .replace(/\\t/g, '\t')
                 .replace(/\\\\/g, '\\');
    allPushes += piece + '\n';
  }
  
  fs.writeFileSync('parsed_pushes.txt', allPushes);
  console.log('Parsed pushes written to parsed_pushes.txt. Length:', allPushes.length);
  
  // Let's look for Korean text or markdown
  const lines = allPushes.split('\n');
  const interestingLines = [];
  for (const line of lines) {
    if (line.includes('prompt') || line.includes('learning') || line.includes('korean') || /[\uac00-\ud7af]/.test(line)) {
      if (line.length > 50) {
        interestingLines.push(line);
      }
    }
  }
  
  console.log(`Found ${interestingLines.length} interesting long lines.`);
  fs.writeFileSync('interesting_lines.txt', interestingLines.join('\n\n---LINE---\n\n'));
}

main();
