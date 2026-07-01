# VPS Deployment Guide — InvestAI (Single Server)

Deploy the full MERN stack on one VPS:

| Service      | URL                          |
|--------------|------------------------------|
| Main site    | `https://example.com`        |
| Admin panel  | `https://admin.example.com`  |
| API          | `https://api.example.com`    |

> **Admin at `/admin` path?** See [Subpath admin](#admin-at-examplecomadmin-subpath) below.

---

## 1. DNS Configuration

Point these A records to your VPS public IP (`YOUR_VPS_IP`):

| Type | Name  | Value         | TTL  |
|------|-------|---------------|------|
| A    | `@`   | YOUR_VPS_IP   | 3600 |
| A    | `www` | YOUR_VPS_IP   | 3600 |
| A    | `admin` | YOUR_VPS_IP | 3600 |
| A    | `api` | YOUR_VPS_IP   | 3600 |

Wait for DNS propagation (5–30 minutes). Verify:

```bash
dig example.com +short
dig admin.example.com +short
dig api.example.com +short
```

---

## 2. VPS Initial Setup (Ubuntu 22.04+)

```bash
# SSH into VPS
ssh root@YOUR_VPS_IP

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Nginx, PM2, Certbot
apt install -y nginx certbot python3-certbot-nginx
npm install -g pm2

# Create app directory
mkdir -p /var/www/ai-invest
mkdir -p /var/log/pm2
mkdir -p /var/www/certbot
```

---

## 3. Clone & Build on VPS

```bash
cd /var/www/ai-invest

# Clone your repo (or upload via scp/rsync)
git clone https://github.com/YOUR_USER/AI-INVEST.git .

# Install dependencies
npm install
npm install --prefix server
npm install --prefix admin

# Environment file for API
cp deploy/env.production.example server/.env
nano server/.env   # fill JWT_SECRET, MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD

# Build frontend (main website)
echo "VITE_API_URL=https://api.example.com/api" > .env.production
npm run build

# Build admin panel (subdomain — base path /)
echo "VITE_API_URL=https://api.example.com/api" > admin/.env.production
VITE_BASE_PATH=/ npm run build --prefix admin

# Copy builds to serve paths
mkdir -p frontend
cp -r dist frontend/
cp -r admin/dist admin/
```

### Admin at `example.com/admin` (subpath)

```bash
echo "VITE_API_URL=https://api.example.com/api" > admin/.env.production
VITE_BASE_PATH=/admin/ npm run build --prefix admin
```

Then use `deploy/nginx/ai-invest-subpath-admin.conf` blocks instead of the `admin.example.com` server block.

---

## 4. Nginx Configuration

```bash
# Copy config (replace example.com with your domain first)
sed 's/example.com/YOUR_DOMAIN/g' deploy/nginx/ai-invest.conf > /etc/nginx/sites-available/ai-invest

# Enable site
ln -sf /etc/nginx/sites-available/ai-invest /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test config (SSL lines will fail until certs exist — that's OK for first pass)
nginx -t
```

---

## 5. SSL with Let's Encrypt

```bash
# Get certificate (covers main + www + admin + api subdomains)
certbot certonly --nginx \
  -d example.com \
  -d www.example.com \
  -d admin.example.com \
  -d api.example.com \
  --email you@example.com \
  --agree-tos \
  --no-eff-email

# Reload Nginx
nginx -t && systemctl reload nginx

# Auto-renewal (certbot timer is installed automatically)
certbot renew --dry-run
```

---

## 6. PM2 — Start Backend API

```bash
cd /var/www/ai-invest

# Start API with PM2
pm2 start deploy/ecosystem.config.cjs

# Save process list & enable startup on reboot
pm2 save
pm2 startup
# Run the command PM2 prints, then:
pm2 save
```

### Useful PM2 commands

```bash
pm2 status                  # check running apps
pm2 logs ai-invest-api      # view logs
pm2 restart ai-invest-api   # restart after .env changes
pm2 stop ai-invest-api
pm2 monit                   # live monitor
```

---

## 7. Verify Deployment

```bash
# API health
curl https://api.example.com/api/health

# Main site
curl -I https://example.com

# Admin panel
curl -I https://admin.example.com
```

Open `https://admin.example.com` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `server/.env`.

---

## 8. Updating After Code Changes

```bash
cd /var/www/ai-invest
git pull

npm install
npm install --prefix server
npm install --prefix admin

npm run build
VITE_BASE_PATH=/ npm run build --prefix admin

cp -r dist frontend/
cp -r admin/dist admin/

pm2 restart ai-invest-api
```

---

## 9. Local Development

```bash
# Terminal 1 — API
npm run dev:server

# Terminal 2 — Main website
npm run dev

# Terminal 3 — Admin panel
npm run dev:admin
```

Set in `server/.env`:

```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-local-password
ADMIN_ORIGIN=http://localhost:5174
```

- Main site: http://localhost:5173
- Admin: http://localhost:5174
- API: http://localhost:3001

---

## Architecture

```
                    ┌─────────────────────────────────┐
                    │           VPS (1 server)         │
                    │                                 │
  example.com ─────►│  Nginx :443                     │
  admin.example.com►│    ├─ /frontend/dist  (static)  │
  api.example.com ─►│    ├─ /admin/dist     (static)  │
                    │    └─ proxy → :3001   (API)     │
                    │              PM2 + Express       │
                    │              MongoDB Atlas       │
                    └─────────────────────────────────┘
```

---

## Security Checklist

- [ ] Strong `JWT_SECRET` (32+ random characters)
- [ ] Strong `ADMIN_PASSWORD`
- [ ] MongoDB Atlas IP whitelist includes VPS IP (or `0.0.0.0/0`)
- [ ] `ufw` firewall: allow 22, 80, 443 only
- [ ] Never commit `.env` files
- [ ] Admin panel has `noindex` meta tag (already set)