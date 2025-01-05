const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://172.31.178.187:8000/api/v1',
      changeOrigin: true,
      secure: false,
      ws: true,
      xfwd: true,
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
      onError: (err, req, res) => {
        console.error('代理错误:', err);
      }
    })
  );
};
