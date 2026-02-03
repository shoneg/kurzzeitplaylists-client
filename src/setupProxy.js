const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(
    ['/auth', '/playlists', '/api'],
    createProxyMiddleware({
      target: 'http://127.0.0.1:8888',
      changeOrigin: true,
    })
  );
};
