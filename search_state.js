import fs from 'fs';

function main() {
  const content = fs.readFileSync('raw_manus.html', 'utf8');
  
  const searchFields = ['shareTitle', 'fileUrl', 'shareInfo', 'fileInfo', 'filename', 'extension'];
  searchFields.forEach(f => {
    const regex = new RegExp(`.{0,300}${f}.{0,300}`, 'gi');
    const matches = content.match(regex) || [];
    console.log(`Field "${f}" match count:`, matches.length);
    if (matches.length > 0) {
      console.log(`Preview matches for "${f}":`, matches.slice(0, 3));
    }
  });
}

main();
