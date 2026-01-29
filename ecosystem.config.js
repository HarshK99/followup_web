module.exports = {
  apps: [{
    name: 'followupx_web',
    script: 'node_modules/.bin/next',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      NEXT_PUBLIC_API_BASE_URL: 'https://followapi.paperthoughts.in',
      PORT: 5001
    }
  }]
};