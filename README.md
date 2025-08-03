# KIENSTORE - Gaming Store Website

A modern gaming store website built with Node.js, Express, MongoDB, and vanilla JavaScript.

## 🚀 Features

### User Features
- **Authentication System**: Register, login, logout with JWT tokens
- **User Profile**: View and update personal information
- **Shopping Cart**: Add/remove items, quantity management
- **Wishlist**: Save favorite games for later
- **Order History**: View past orders and their status
- **Game Browsing**: Search, filter by category/platform, sort by price
- **Responsive Design**: Works on desktop, tablet, and mobile

### Admin Features
- **Admin Panel**: Dashboard with statistics
- **Product Management**: Add, edit, delete products
- **Order Management**: View and update order status
- **User Management**: View and manage user accounts
- **Sales Reports**: Revenue and order analytics

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **UI Framework**: Bootstrap 5
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Deployment**: Railway (Backend), Vercel (Frontend)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Railway account (for backend deployment)
- Vercel account (for frontend deployment)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd asm-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=3000
```

### 4. Create Admin User
```bash
node create-admin.js
```
This will create an admin user with:
- Email: `admin@kienstore.com`
- Password: `admin123`

### 5. Start the Server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
asm-website/
├── models/              # MongoDB schemas
│   ├── User.js         # User model
│   ├── Product.js      # Product model
│   └── Order.js        # Order model
├── js/                 # Frontend JavaScript
│   ├── auth.js         # Authentication functions
│   ├── cart.js         # Shopping cart functions
│   ├── config.js       # API configuration
│   ├── games.js        # Game-related functions
│   ├── main.js         # Main application logic
│   └── utils.js        # Utility functions
├── css/                # Stylesheets
│   └── styles.css      # Custom styles
├── images/             # Game images and assets
├── server.js           # Express server
├── create-admin.js     # Admin user creation script
├── package.json        # Dependencies and scripts
└── index.html          # Main HTML file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/validate` - Validate JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/admin/products` - Create product (Admin)
- `PUT /api/admin/products/:id` - Update product (Admin)
- `DELETE /api/admin/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get specific order
- `GET /api/admin/orders` - Get all orders (Admin)
- `PUT /api/admin/orders/:id/status` - Update order status (Admin)

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user

## 👤 User Roles

### Regular User
- Browse games
- Add items to cart
- Create orders
- View order history
- Manage profile
- Add games to wishlist

### Admin User
- All regular user features
- Access admin panel
- Manage products (CRUD)
- Manage orders
- View user management
- Access dashboard statistics

## 🎮 Game Categories

- Action
- Adventure
- RPG
- Strategy
- Sports
- Racing
- FPS
- MOBA
- Horror
- Puzzle
- Simulation
- Battle Royale

## 🛒 Shopping Features

- **Cart Management**: Add, remove, update quantities
- **Wishlist**: Save favorite games
- **Order Processing**: Complete checkout process
- **Order Tracking**: View order status and history
- **Price Display**: Support for sales and discounts

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- Admin role verification

## 📱 Responsive Design

The website is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚀 Deployment

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure build settings
3. Deploy automatically on push to main branch

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your MongoDB URI in `.env`
   - Ensure IP whitelist includes 0.0.0.0/0

2. **JWT Token Issues**
   - Verify JWT_SECRET is set in environment variables
   - Check token expiration settings

3. **Admin Access Issues**
   - Run `node create-admin.js` to create admin user
   - Verify admin user has `isAdmin: true` in database

4. **CORS Errors**
   - Check CORS configuration in `server.js`
   - Verify frontend URL is in allowed origins

## 📞 Support

For support and questions:
- Email: support@kienstore.com
- Phone: +84 123 456 789

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This is a demo project for educational purposes. In production, implement additional security measures and error handling.


