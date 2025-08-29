const { env } = require('process');

// Backend API URL'sini belirle
const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7073';

const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/api/Film",
      "/api/Actor",
      "/api/Category"
    ],
    target,
    secure: false,
    changeOrigin: true,
    logLevel: "debug"
  }
]

module.exports = PROXY_CONFIG;
