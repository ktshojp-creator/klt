import fs from 'fs';

function main() {
  const files = fs.readdirSync('.');
  const jsFiles = files.filter(f => f.endsWith('.js'));
  console.log(`Scanning ${jsFiles.length} JS files...`);

  jsFiles.forEach(file => {
    const text = fs.readFileSync(file, 'utf8');
    
    const searchTerms = ['fileShareId', 'shareInfo', 'getShare', 'shareFile', 'share_file'];
    searchTerms.forEach(term => {
      let idx = 0;
      let count = 0;
      while ((idx = text.indexOf(term, idx)) !== -1) {
        count++;
        console.log(`- File ${file}, Found term "${term}" (Match ${count}):`);
        console.log(text.slice(Math.max(0, idx - 150), Math.min(text.length, idx + term.length + 150)));
        idx += term.length;
      }
    });
  });
}

main();
