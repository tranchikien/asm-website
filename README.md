# KIENSTORE - Game Store Website

## 📝 Mô tả
Website bán game trực tuyến với giao diện hiện đại và responsive. Người dùng có thể đăng ký, đăng nhập, mua game và quản lý profile.

## 🚀 Tính năng chính

### 👤 Quản lý tài khoản
- Đăng ký tài khoản mới
- Đăng nhập/Đăng xuất
- Cập nhật thông tin profile
- Đổi mật khẩu

### 🛒 Giỏ hàng & Thanh toán
- Thêm/xóa sản phẩm vào giỏ hàng
- Tính tổng tiền tự động
- Thanh toán với nhiều phương thức
- Auto-fill thông tin từ profile

### 🎮 Quản lý sản phẩm
- Hiển thị danh sách game
- Tìm kiếm và lọc theo danh mục
- Chi tiết sản phẩm
- Wishlist

### 📱 Responsive Design
- Tương thích mobile/tablet/desktop
- Giao diện hiện đại với dark theme
- Animations và transitions mượt mà

## 🛠️ Công nghệ sử dụng

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5 (UI Framework)
- Font Awesome (Icons)
- LocalStorage (Data Storage)

### Backend (Planned)
- Node.js + Express.js
- MongoDB/MySQL (Database)
- JWT Authentication
- RESTful API

## 📁 Cấu trúc thư mục

```
asm-website/
├── index.html          # Trang chủ
├── css/
│   └── styles.css      # Styles chính
├── js/
│   ├── main.js         # Logic chính
│   ├── auth.js         # Xử lý authentication
│   ├── cart.js         # Quản lý giỏ hàng
│   ├── games.js        # Dữ liệu game
│   └── utils.js        # Utility functions
├── images/             # Hình ảnh sản phẩm
├── README.md
└── .gitignore
```

## 🚀 Cách chạy

### Local Development
1. Clone repository:
```bash
git clone <repository-url>
cd asm-website
```

2. Mở file `index.html` trong trình duyệt hoặc sử dụng live server:
```bash
# Nếu có Python
python -m http.server 8000

# Nếu có Node.js
npx live-server
```

3. Truy cập: `http://localhost:8000`

## 🔧 Cài đặt

### Yêu cầu hệ thống
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Git (để clone repository)

### Dependencies
- Bootstrap 5 (CDN)
- Font Awesome (CDN)
- jQuery (CDN)

## 📊 Database Schema (Planned)

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    birthday DATE,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category VARCHAR(100),
    platform VARCHAR(100),
    image_url VARCHAR(500),
    is_sale BOOLEAN DEFAULT FALSE,
    sale_percentage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    total_amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔄 API Endpoints (Planned)

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

### Users
- `GET /api/users/profile` - Lấy thông tin profile
- `PUT /api/users/profile` - Cập nhật profile
- `PUT /api/users/password` - Đổi mật khẩu

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `GET /api/products/search` - Tìm kiếm sản phẩm

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Lấy lịch sử đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng

## 🚀 Deployment

### Vercel (Recommended)
1. Push code lên GitHub
2. Kết nối với Vercel
3. Deploy tự động

### Netlify
1. Push code lên GitHub
2. Kết nối với Netlify
3. Deploy tự động

## 👨‍💻 Tác giả
- **Tên:** [Trần Chí Kiên]
- **MSSV:** [BH01318]
- **Lớp:** [SE07201]

## 📄 License
MIT License

## 🤝 Contributing
1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request 