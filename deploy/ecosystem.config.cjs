module.exports = {
  apps: [
    {
      name: 'ai-invest-api',
      cwd: '/var/www/ai-invest/server',
      script: 'index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        SERVE_STATIC: 'false',
      },
      error_file: '/var/log/pm2/ai-invest-api-error.log',
      out_file: '/var/log/pm2/ai-invest-api-out.log',
      merge_logs: true,
      time: true,
    },
  ],
}