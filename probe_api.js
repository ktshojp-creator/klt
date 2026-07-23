async function probe(url) {
  try {
    console.log(`Probing: ${url}`);
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log(`Status: ${res.status}`);
    const contentType = res.headers.get('content-type') || '';
    console.log(`Content-Type: ${contentType}`);
    if (res.ok) {
      if (contentType.includes('json')) {
        const json = await res.json();
        console.log('SUCCESS JSON:', JSON.stringify(json).slice(0, 1000));
        return { success: true, url, json };
      } else {
        const text = await res.text();
        console.log('SUCCESS TEXT:', text.slice(0, 1000));
        return { success: true, url, text };
      }
    }
  } catch (err) {
    console.log(`Error probing ${url}:`, err.message);
  }
  return { success: false };
}

async function main() {
  const uuid = '3bf7586f-d32b-4543-bcd8-313789d462cc';
  const urls = [
    `https://api.manus.im/api/v1/share/file/${uuid}`,
    `https://api.manus.im/api/share/file/${uuid}`,
    `https://api.manus.im/v1/share/file/${uuid}`,
    `https://api.manus.im/share/file/${uuid}`,
    `https://api.manus.im/api/v1/file/share/${uuid}`,
    `https://api.manus.im/api/file/share/${uuid}`,
    `https://api.manus.im/api/v1/file-share/${uuid}`,
    `https://api.manus.im/api/file-share/${uuid}`,
    `https://api.manus.im/api/v1/shares/files/${uuid}`,
    `https://api.manus.im/api/shares/files/${uuid}`,
    `https://api.manus.im/api/v1/share/file/info/${uuid}`,
    `https://api.manus.im/api/share/file/info/${uuid}`,
    `https://api.manus.im/api/v1/file/info?shareId=${uuid}`,
    `https://api.manus.im/api/v1/share/file?fileShareId=${uuid}`,
  ];

  for (const url of urls) {
    const result = await probe(url);
    if (result.success) {
      console.log('FOUND SUCCESSFUL ENDPOINT:', url);
      break;
    }
    console.log('-'.repeat(40));
  }
}

main().catch(console.error);
