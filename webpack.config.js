module.exports = {
  // ... 其他配置 ...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://172.31.178.187:8000/api/v1',
        changeOrigin: true,
      },
    },
    allowedHosts: ['localhost', '.localhost', '127.0.0.1','172.31.178.187'],
    host: 'localhost',
    port: 3000,
  },
};