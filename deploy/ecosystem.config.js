// ecosystem.config.js
// PM2 Configuration for lms.techcorp.info.vn
module.exports = {
  apps: [
    {
      name: 'lms-backend',
      script: 'server.js',
      cwd: '/www/wwwroot/lms.techcorp.info.vn/backend',
      instances: 2,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5009
      }
    }
  ]
};
