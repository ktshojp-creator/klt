import fs from 'fs';

function main() {
  const content = fs.readFileSync('raw_manus.html', 'utf8');
  
  const uuid = '3bf7586f-d32b-4543-bcd8-313789d462cc';
  let pos = 0;
  let count = 0;
  while ((pos = content.indexOf(uuid, pos)) !== -1) {
    count++;
    console.log(`--- Occurrence ${count} at index ${pos} ---`);
    console.log(content.slice(Math.max(0, pos - 150), Math.min(content.length, pos + uuid.length + 150)));
    pos += uuid.length;
  }
}

main();
