module.exports = {
  apps: [{
    name: 'followup-web',
    script: 'standalone/server.js',
    env: {
      NODE_ENV: 'production',
      NEXT_PUBLIC_API_BASE_URL: 'https://followapi.paperthoughts.in',
      PORT: 5001
    }
  }]
};