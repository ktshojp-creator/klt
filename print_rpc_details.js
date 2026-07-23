import fs from 'fs';

function main() {
  const text = fs.readFileSync('91896-17fde9214c6123a1.js', 'utf8');
  
  // Let's find "Am" definition. Since we saw: "SessionPublicService:(0,X.UU)(Am,A)"
  // Let's find the declaration "let Am=" or "var Am=" or "const Am=" or "Am="
  // Usually, Connect service definition is an object containing the service name:
  // e.g. typeName: "manus.v1.SessionPublicService" or similar.
  
  let pos = text.indexOf('SessionPublicService');
  if (pos !== -1) {
    console.log('Found SessionPublicService in JS.');
    // Let's print the preceding 500 and succeeding 1000 characters
    console.log(text.slice(Math.max(0, pos - 500), Math.min(text.length, pos + 1000)));
  }

  // Also let's search for "typeName" in the entire file
  let typeNamePos = 0;
  while ((typeNamePos = text.indexOf('typeName', typeNamePos)) !== -1) {
    console.log(`typeName reference:`);
    console.log(text.slice(typeNamePos - 50, typeNamePos + 150));
    typeNamePos += 'typeName'.length;
  }
}

main();
