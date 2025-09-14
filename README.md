# 🍕 Pizza Pro - Professional Pizza Delivery Platform

A full-stack pizza delivery application built with the MERN stack, featuring real-time order tracking, payment integration, and separate admin/customer dashboards.

# 🌟 Features

## Customer Features
- User Registration & Authentication - Secure JWT-based authentication
- Interactive Pizza Customizer - Build custom pizzas with real-time pricing
- Order Management - Place, track, and cancel orders
- Real-time Order Tracking - Live status updates with progress indicators
- Payment Integration - Razorpay payment gateway integration
- Order History - View past orders and reviews
- Responsive Design - Works perfectly on desktop and mobile

### Admin Features
- Admin Dashboard - Comprehensive analytics and order management
- Order Management - Update order status, view customer details
- Inventory Management - Track ingredients and stock levels
- User Management - View and manage customer accounts
- Email Notifications - Automated order confirmations and updates
- Low Stock Alerts - Get notified when ingredients are running low

## 🛠️ Tech Stack

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM for MongoDB
- JWT - Authentication
- Razorpay - Payment processing
- Nodemailer - Email notifications
- Handlebars - Email templating
- bcryptjs - Password hashing

### Frontend
- React.js - Frontend framework
- React Router - Client-side routing
- Axios - HTTP client
- Material-UI - UI components
- CSS3 - Styling with gradients and animations

## 📁 Project Structure

```
pizza-delivery-app/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Order.js
│   │   └── Inventory.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── orders.js
│   │   ├── payment.js
│   │   ├── inventory.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── services/
│   │   └── emailService.js
│   ├── email-templates/
│   │   ├── order-confirmation.html
│   │   └── order-status-update.html
│   ├── seeders/
│   │   ├── seedInventory.js
│   │   └── seedOrders.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── User/
│   │   │   ├── Admin/
│   │   │   └── common/
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/shivamsharma-3/pizza-delivery-app
cd pizza-delivery-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Configure Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pizzadelivery
JWT_SECRET=78e14ecf2729e0a00817c984fa898c91
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=customer@test.com
EMAIL_PASSWORD=password123
ADMIN_EMAIL=admin@pizzadelivery.com
FRONTEND_URL=http://localhost:3000
```

#### Seed Initial Data
```bash
# Create admin user
node createAdmin.js

# Create test customer
node createTestUser.js

# Seed inventory items
node seeders/seedInventory.js

# Seed sample orders (optional)
node seeders/seedOrders.js
```

#### Start Backend Server
```bash
npm run dev
```
Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start frontend server
npm start
```
Frontend will run on `http://localhost:3000`

## 🧪 Testing the Application

### Test Accounts

Admin Login:
- Email: `admin@pizzadelivery.com`
- Password: `admin123`

Customer Login:
- Email: `customer@test.com`
- Password: `password123`

### Test Flow
1. Visit `http://localhost:3000`
2. Click "Customer Login" and use test credentials
3. Explore the pizza customizer and place an order
4. Try order tracking with the order number
5. Login as admin to manage orders and view analytics

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Orders
- `GET /api/orders/my-orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/track/:orderNumber` - Track order
- `PUT /api/orders/:id/cancel` - Cancel order

### Inventory
- `GET /api/inventory` - Get all ingredients
- `POST /api/inventory` - Add new ingredient (Admin)
- `PUT /api/inventory/:id` - Update ingredient (Admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/:id/status` - Update order status

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify-payment` - Verify payment

## 🔧 Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

Frontend:
```bash
cd frontend
npm start  # Hot reload enabled
```

### Useful Scripts

Backend:
```bash
npm run dev          # Start with nodemon
npm start           # Start in production mode
node checkUsers.js  # List all users
node checkDatabase.js # Check database connection
```

Frontend:
```bash
npm start    # Development server
npm build    # Production build
npm test     # Run tests
```

## 🚀 Deployment

### Backend Deployment (Heroku Example)
```bash
# In backend directory
heroku create your-pizza-app-backend
heroku config:set MONGODB_URI=<your-mongodb-atlas-uri>
heroku config:set JWT_SECRET=<your-jwt-secret>
# Set other environment variables
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)
```bash
# In frontend directory
npm run build
# Deploy the build folder to your hosting service
```

## 🎨 Customization

### Branding
- Update logo and colors in `src/App.css`
- Modify header component in `src/components/common/Header.js`
- Customize email templates in `backend/email-templates/`

### Adding Features
- New ingredients: Add to inventory seeder
- Payment methods: Extend payment routes
- Notifications: Modify email service

## 🐛 Troubleshooting

### Common Issues

1. MongoDB Connection Error
   ```bash
   # Make sure MongoDB is running
   sudo systemctl start mongod  # Linux
   brew services start mongodb  # macOS
   ```

2. Port Already in Use
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   ```

3. CORS Issues
   - Ensure `FRONTEND_URL` in backend `.env` matches frontend URL

4. Email Not Working
   - Use Gmail app password, not regular password
   - Enable 2FA and generate app-specific password

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: shivamsharma4c@gmail.com
- Documentation: https://github.com/shivamsharma-3/pizza-delivery-app

## 🎯 Roadmap

- [ ] Real-time notifications with WebSocket
- [ ] Mobile app (React Native)
- [ ] Multiple restaurant locations
- [ ] Loyalty program
- [ ] Advanced analytics dashboard
- [ ] Integration with delivery partners

---

Made with ❤️ and lots of 🍕

---

## Quick Start Commands

```bash
# Backend
cd backend && npm install && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm start

# Visit http://localhost:3000
```
# pizza-delivery-app
Professional pizza delivery platform with MERN stack
b30c912b23f072885e5de8b257cc3f31ce0c29a0
