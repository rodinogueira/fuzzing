const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 8082;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/search') {
    const q = parsedUrl.query.q || '';

    const body = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head><meta charset="UTF-8" /><title>Search</title></head>
        <body>
          <h1>Resultado da busca</h1>
          <p>Você pesquisou: ${q}</p> <!-- vulnerável a XSS refletido -->
        </body>
      </html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end(body);

  } else if (parsedUrl.pathname === '/file') {
    const filePath = parsedUrl.query.name || 'default.txt';

    // Vulnerável a directory traversal (não recomendado para produção)
    const fullPath = path.join(__dirname, 'public', filePath);

    fs.readFile(fullPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Arquivo não encontrado');
      } else {
        res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
        res.end(data);
      }
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Servidor vulnerável rodando na porta ${PORT}`);
});
