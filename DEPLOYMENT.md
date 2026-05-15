# 🚀 Panduan Deployment

## Frontend → Vercel

### Langkah-langkah:

1. **Build project:**
```bash
cd frontend
npm run build
```

2. **Install Vercel CLI:**
```bash
npm install -g vercel
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Set Environment Variables di Vercel Dashboard:**
```
VITE_API_URL=https://your-backend.railway.app/api
VITE_SOCKET_URL=https://your-backend.railway.app
```

---

## Backend → Railway

### Langkah-langkah:

1. Push code ke GitHub

2. Buka [railway.app](https://railway.app) → New Project → Deploy from GitHub

3. Pilih repository → pilih folder `backend`

4. Set Environment Variables:
```
PORT=5000
NODE_ENV=production
DB_HOST=<railway-mysql-host>
DB_PORT=<railway-mysql-port>
DB_USER=<railway-mysql-user>
DB_PASSWORD=<railway-mysql-password>
DB_NAME=iot_water
JWT_SECRET=<random-secret-key>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-app.vercel.app
```

5. Tambahkan `Procfile` di folder backend:
```
web: node server.js
```

---

## Database → Railway MySQL

1. Di Railway project → Add Service → Database → MySQL

2. Salin connection details ke environment variables backend

3. Jalankan SQL schema:
```bash
# Gunakan Railway CLI atau MySQL client
mysql -h <host> -P <port> -u <user> -p<password> iot_water < backend/config/database.sql
```

---

## Backend → Render

1. Buka [render.com](https://render.com) → New Web Service

2. Connect GitHub repository

3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

4. Set Environment Variables (sama seperti Railway)

---

## Checklist Deployment

- [ ] Database schema sudah dijalankan
- [ ] Environment variables sudah diset
- [ ] CORS origin sudah diupdate ke domain frontend
- [ ] JWT_SECRET sudah diganti dengan nilai yang aman
- [ ] Admin password sudah diganti
- [ ] HTTPS sudah aktif (otomatis di Vercel/Railway/Render)
- [ ] ESP32 SERVER_URL sudah diupdate ke URL production
