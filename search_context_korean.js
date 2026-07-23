import fs from 'fs';

function main() {
  const content = fs.readFileSync('parsed_pushes.txt', 'utf8');
  
  // Find all matches for "korean" and print 500 characters around them
  const regex = /.{0,500}korean.{0,500}/gi;
  const matches = content.match(regex) || [];
  console.log(`Found ${matches.length} matches for "korean":`);
  
  matches.forEach((m, i) => {
    console.log(`--- Match ${i+1} ---`);
    console.log(m);
  });
}

main();
