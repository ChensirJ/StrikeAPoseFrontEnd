const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://172.31.178.187:8000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api/v1',
      },
      onProxyReq: function(proxyReq, req, res) {
        console.log('代理请求:', req.method, req.url);
      },
      onError: function(err, req, res) {
        console.error('代理错误:', err);
      }
    })
  );
};
