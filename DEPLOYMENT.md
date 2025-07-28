# 🚀 Hướng dẫn Deployment KIENSTORE

## 📋 Yêu cầu hệ thống

### Development
- Node.js (v14.0.0 trở lên)
- MongoDB (local hoặc cloud)
- Git

### Production
- Vercel/Netlify (Frontend)
- Heroku/Railway (Backend)
- MongoDB Atlas (Database)

## 🔧 Cài đặt Local

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd asm-website
```

### 2. Cài đặt Dependencies
```bash
npm install
```

### 3. Cấu hình Environment
```bash
# Copy file env.example thành .env
cp env.example .env

# Chỉnh sửa file .env với thông tin của bạn
```

### 4. Cài đặt MongoDB
#### Option 1: MongoDB Local
```bash
# Windows
# Tải và cài đặt MongoDB từ https://www.mongodb.com/try/download/community

# macOS
brew install mongodb-community

# Linux
sudo apt-get install mongodb
```

#### Option 2: MongoDB Atlas (Recommended)
1. Tạo tài khoản tại https://www.mongodb.com/atlas
2. Tạo cluster mới
3. Lấy connection string
4. Cập nhật MONGODB_URI trong file .env

### 5. Chạy ứng dụng
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 6. Truy cập ứng dụng
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

## 🌐 Deployment

### Option 1: Vercel (Frontend) + Heroku (Backend)

#### Frontend (Vercel)
1. Push code lên GitHub
2. Đăng ký tài khoản Vercel
3. Import project từ GitHub
4. Cấu hình build settings:
   - Build Command: `npm run build` (nếu có)
   - Output Directory: `.`
   - Install Command: `npm install`
5. Deploy

#### Backend (Heroku)
1. Tạo app trên Heroku
2. Kết nối với GitHub repository
3. Cấu hình environment variables:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secret-key
   NODE_ENV=production
   ```
4. Deploy

### Option 2: Railway (Full Stack)

1. Đăng ký tài khoản Railway
2. Import project từ GitHub
3. Cấu hình environment variables
4. Deploy

### Option 3: Netlify (Frontend) + Railway (Backend)

#### Frontend (Netlify)
1. Push code lên GitHub
2. Đăng ký tài khoản Netlify
3. Import project từ GitHub
4. Cấu hình build settings
5. Deploy

#### Backend (Railway)
1. Đăng ký tài khoản Railway
2. Import project từ GitHub
3. Cấu hình environment variables
4. Deploy

## 🔗 Cấu hình CORS

Để frontend và backend hoạt động trên các domain khác nhau, cần cấu hình CORS:

```javascript
// Trong server.js
app.use(cors({
    origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
    credentials: true
}));
```

## 🔐 Environment Variables

### Development (.env)
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/kienstore
```

### Production
```
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-production-key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kienstore
```

## 📊 Database Setup

### MongoDB Atlas
1. Tạo cluster mới
2. Tạo database user
3. Whitelist IP addresses
4. Lấy connection string

### Local MongoDB
```bash
# Start MongoDB service
mongod

# Tạo database
mongo
use kienstore
```

## 🧪 Testing

### API Testing
```bash
# Test đăng ký
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullname":"Test User"}'

# Test đăng nhập
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Frontend Testing
1. Mở http://localhost:3000
2. Test đăng ký/đăng nhập
3. Test thêm sản phẩm vào giỏ hàng
4. Test checkout

## 🔍 Troubleshooting

### Lỗi MongoDB Connection
```bash
# Kiểm tra MongoDB service
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

### Lỗi Port đã được sử dụng
```bash
# Tìm process sử dụng port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Lỗi CORS
- Kiểm tra cấu hình CORS trong server.js
- Đảm bảo frontend và backend domain được whitelist

## 📈 Monitoring

### Logs
```bash
# Xem logs
npm run dev

# Production logs
heroku logs --tail
```

### Performance
- Sử dụng MongoDB Compass để monitor database
- Sử dụng Postman để test API
- Sử dụng Chrome DevTools để debug frontend

## 🔄 CI/CD

### GitHub Actions
Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
        heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## 📞 Support

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs
2. Kiểm tra environment variables
3. Kiểm tra database connection
4. Liên hệ support team 