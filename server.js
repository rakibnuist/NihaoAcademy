const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
    console.log(`> Ready on http://localhost:${port} (listening on Hostinger assigned port)`);
  });
}).catch((err) => {
  console.error('Next.js custom server startup error:', err);
  process.exit(1);
});
