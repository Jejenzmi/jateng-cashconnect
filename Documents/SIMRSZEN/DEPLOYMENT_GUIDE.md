# Deployment Guide - SIMRS ZEN

## Production Deployment Requirements

### Server Requirements
- Linux Ubuntu 20.04 LTS or higher
- Node.js v16.x or higher
- PostgreSQL 12 or higher
- Redis (for caching)
- Nginx (web server/reverse proxy)
- PM2 (process manager)
- Certbot (for SSL certificates)

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/simrszen.git
cd simrszen
```

2. Install backend dependencies:
```bash
cd backend
npm install --production
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install --production
```

### Environment Variables

Create `.env` file in the backend directory with the following content:

```env
# Application Configuration
NODE_ENV=production
PORT=3001
CLIENT_URL=https://yourdomain.com

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/simrszen"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-here
REFRESH_TOKEN_EXPIRES_IN=7d

# Logging Configuration
LOG_LEVEL=info
LOG_DIR=logs

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION_MINUTES=30

# Backup Configuration
BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 2 * * *" # Daily at 2 AM
BACKUP_RETENTION_DAYS=30
BACKUP_LOCATION=/backups/simrszen

# Cache Configuration
CACHE_TTL_SECONDS=3600
REDIS_URL=redis://localhost:6379

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@simrszen.com
```

### Database Migration

Run database migrations:
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### Building the Frontend

Build the frontend application:
```bash
cd frontend
npm run build
```

### Starting the Application

1. Start the backend with PM2:
```bash
cd backend
npm install -g pm2
pm2 start src/server.ts --name "simrszen-backend" --interpreter npx --interpreter-args "ts-node"
```

2. Configure Nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Frontend static files
    location / {
        root /path/to/simrszen/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # API requests proxy to backend
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3001/health;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

3. Obtain SSL certificate with Certbot:
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Backup Strategy

Set up automated backups with cron:
```bash
# Edit crontab
crontab -e

# Add the following line to backup daily at 2 AM
0 2 * * * /path/to/simrszen/scripts/backup.sh
```

Example backup script (`scripts/backup.sh`):
```bash
#!/bin/bash

# Database backup
pg_dump -U username -h localhost simrszen > /backups/simrszen/backup_$(date +%Y%m%d_%H%M%S).sql

# Remove backups older than retention days
find /backups/simrszen -name "*.sql" -mtime +30 -delete
```

### Monitoring and Logging

1. Set up log rotation:
```bash
sudo nano /etc/logrotate.d/simrszen

/path/to/simrszen/backend/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    copytruncate
    notifempty
    create 644 nodejs nodejs
}
```

2. Monitor application with PM2:
```bash
# View application logs
pm2 logs simrszen-backend

# Monitor resource usage
pm2 monit

# Setup PM2 startup script
pm2 startup
pm2 save
```

### Health Checks

The application provides a health check endpoint at:
`https://yourdomain.com/health`

Expected response:
```json
{
  "status": "OK",
  "service": "SIMRS ZEN",
  "version": "1.0.0",
  "timestamp": "2026-04-25T02:02:35.807Z"
}
```

### Troubleshooting

1. **Application won't start**:
   - Check environment variables are set correctly
   - Verify database connection
   - Review logs in `backend/logs/`

2. **SSL certificate issues**:
   - Run `sudo certbot renew --dry-run` to test renewal
   - Check Nginx configuration syntax with `sudo nginx -t`

3. **Database connection errors**:
   - Verify PostgreSQL is running: `sudo systemctl status postgresql`
   - Test connection with provided credentials
   - Check firewall settings

4. **Performance issues**:
   - Monitor system resources with `htop`
   - Check database query performance
   - Review application logs for errors