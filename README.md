# 🎂 79 Baker's - Online Cake Shop

A modern, full-stack e-commerce platform for ordering delicious cakes online. Built with Next.js, MongoDB, and React.

![79 Baker's](https://img.shields.io/badge/Status-Live-success)
![Next.js](https://img.shields.io/badge/Next.js-15.3-black)
![MongoDB](https://img.shields.io/badge/MongoDB-8.19-green)
![React](https://img.shields.io/badge/React-Latest-blue)

## 🌐 Live Demo

**Website**: [79-bakers.vercel.app](https://79-bakers.vercel.app)

## ✨ Features

### For Customers
- 🛍️ Browse cakes with advanced filters (category, price, rating, search)
- 🎨 Beautiful product detail pages with images and descriptions
- 🛒 Real-time shopping cart with quantity controls
- 💳 Complete 3-step checkout process
- 👤 User authentication (Register/Login)
- 📦 Order history and tracking
- 📍 Order progress indicators
- 📞 Contact form for inquiries

### For Administrators
- 📊 Admin dashboard with statistics
- ➕ Add/Edit/Delete products
- 📋 Manage all orders
- 🔄 Update order status
- 🔍 Search and filter orders
- 📈 View sales analytics

### Technical Features
- 🏆 Dynamic Best Sellers (based on actual sales data)
- 🔄 Real-time inventory management
- 🔐 Secure JWT authentication with httpOnly cookies
- 💾 MongoDB database integration
- 📱 Fully responsive design
- ✨ Beautiful animations with Framer Motion
- 🎯 Toast notifications for user feedback

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with httpOnly cookies
- **UI Components**: Lucide React icons, Framer Motion
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Notifications**: React Hot Toast

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB (local or Atlas account)
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bhavik3105/79-bakers.git
   cd 79-bakers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/79bakers
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/79bakers
   
   # JWT Secret (generate a secure random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this
   
   # Site URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Generate a secure JWT secret**
   ```powershell
   # For Windows PowerShell:
   .\scripts\generateJWTSecret.ps1
   ```

5. **Seed the database**
   ```bash
   node scripts/seedProducts.js
   node scripts/createAdmin.js
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

## 👤 Default Admin Credentials

- **Email**: admin@79bakers.com
- **Password**: admin123

⚠️ **Important**: Change the admin password after first login!

## 📁 Project Structure

```
79-bakers/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── BestSeller.js   # Dynamic best sellers
│   ├── CakeGallery.js  # Product grid
│   ├── CartSidebar.js  # Shopping cart
│   └── Navbar.js       # Navigation
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state
│   └── CartContext.js  # Shopping cart state
├── lib/                # Utility functions
│   ├── mongodb.js      # Database connection
│   └── auth.js         # Authentication helpers
├── models/             # MongoDB schemas
│   ├── User.js         # User model
│   ├── Product.js      # Product model
│   ├── Order.js        # Order model
│   └── Review.js       # Review model
├── pages/              # Next.js pages
│   ├── api/           # API routes
│   ├── admin/         # Admin panel
│   ├── auth/          # Authentication pages
│   ├── orders/        # Order pages
│   └── product/       # Product pages
├── public/            # Static files
│   └── images/        # Product images
└── scripts/           # Utility scripts
    ├── seedProducts.js
    └── createAdmin.js
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/best-sellers` - Get best-selling products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id` - Update order status (admin)

### Reviews
- `GET /api/products/:id/reviews` - Get product reviews
- `POST /api/products/:id/reviews` - Add review

### Contact
- `POST /api/contact` - Submit contact form

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel Dashboard**
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SITE_URL`

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 📝 Documentation

- [**PROJECT_COMPLETE.md**](PROJECT_COMPLETE.md) - Complete project overview
- [**DEPLOYMENT_GUIDE.md**](DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [**TESTING_GUIDE.md**](TESTING_GUIDE.md) - Comprehensive testing checklist
- [**QUICK_START.md**](QUICK_START.md) - Quick reference guide

## 🧪 Testing

Run the complete testing checklist:
```bash
# Start development server
npm run dev

# Follow the testing guide
# See TESTING_GUIDE.md for detailed checklist
```

## 🔐 Security

- JWT tokens stored in httpOnly cookies
- Passwords hashed with bcryptjs
- Input validation on all forms
- Protected API routes
- Role-based access control
- Environment variables for sensitive data

## 🎨 Screenshots

### Homepage
![Homepage](public/images/screenshots/homepage.png)

### Product Detail
![Product Detail](public/images/screenshots/product-detail.png)

### Admin Dashboard
![Admin Dashboard](public/images/screenshots/admin-dashboard.png)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Bhavik Patel**
- GitHub: [@Bhavik3105](https://github.com/Bhavik3105)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the database
- Vercel for hosting
- All the open-source libraries used in this project

## 📞 Support

For support, email support@79bakers.com or create an issue in this repository.

---

**Built with ❤️ using Next.js, MongoDB, React, and Tailwind CSS**

⭐ Star this repo if you find it helpful!
