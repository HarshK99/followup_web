module.exports = {
  apps: [{
    name: 'followupx_web',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 5001',
    env: {
      NODE_ENV: 'production',
      NEXT_PUBLIC_API_BASE_URL: 'https://followapi.paperthoughts.in'
    }
  }]
};