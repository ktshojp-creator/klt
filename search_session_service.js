import fs from 'fs';

function main() {
  const files = fs.readdirSync('.');
  const jsFiles = files.filter(f => f.endsWith('.js'));
  console.log(`Scanning JS files for SessionPublicService...`);

  jsFiles.forEach(file => {
    const text = fs.readFileSync(file, 'utf8');
    
    let idx = 0;
    while ((idx = text.indexOf('SessionPublicService', idx)) !== -1) {
      console.log(`- File ${file}:`);
      console.log(text.slice(Math.max(0, idx - 150), Math.min(text.length, idx + 200)));
      idx += 'SessionPublicService'.length;
    }

    idx = 0;
    while ((idx = text.indexOf('getSharedSessionFile', idx)) !== -1) {
      console.log(`- File ${file} (getSharedSessionFile):`);
      console.log(text.slice(Math.max(0, idx - 150), Math.min(text.length, idx + 200)));
      idx += 'getSharedSessionFile'.length;
    }
  });
}

main();
