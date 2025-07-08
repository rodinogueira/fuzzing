const http = require('http');

const host = 'localhost';
const port = 8082;

const paths = [
  '/admin',
  '/config',
  '/backup.zip',
  '/file?name=../../.env',
  '/.git',
  '/old',
  '/hidden',
  '/api/private',
  '/file?name=../main.js',
  '/search?q=test'
];

function testPath(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: host, port, path }, (res) => {
      resolve({ path, status: res.statusCode });
    }).on('error', reject);
  });
}

async function discoverRoutes() {
  console.log('🚀 Iniciando descoberta de caminhos...');

  for (const path of paths) {
    try {
      const result = await testPath(path);
      console.log(`📂 ${result.path} → ${result.status}`);
    } catch (err) {
      console.error(`Erro em ${path}:`, err.message);
    }
  }
}

discoverRoutes();
