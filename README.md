# 🛒 Modern POS System - Point of Sale Application

<img width="2553" height="1224" alt="image" src="https://github.com/user-attachments/assets/d902d284-3d2b-4daa-8699-d995ea46a59d" />

A comprehensive Point of Sale system for businesses, built with React, TypeScript and modern web technologies.

## 🌟 Features

- 🔐 **Secure Authentication** - JWT-based user authorization
- 📦 **Product Management** - Add, edit, delete products and category management
- 🛍️ **Sales Operations** - Fast and easy sales processing, cart management
- 🧾 **Receipts and Invoicing** - Automatic receipt generation and printing
- 📊 **Reporting** - Daily, weekly, monthly sales reports
- 👥 **Customer Management** - Customer records and sales history
- 💰 **Cash Register Management** - Daily cash register opening/closing operations
- 📱 **Responsive Design** - Tablet and desktop compatible interface
- ⚡ **Fast Search** - Instant search for products and customers
- 🏪 **Multi-Store** - Multiple store support

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form state management
- **Zustand** - Lightweight state management

### Backend & Database
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Microsoft SQL Server** - Relational database
- **JWT** - JSON Web Token authentication

## 📋 Requirements

- Node.js 18.0 or higher
- npm or yarn package manager
- Microsoft SQL Server 2019 or higher
- SQL Server Management Studio (optional)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd pos-system
```

2. **Install backend dependencies**
```bash
cd server
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
```

4. **Set up environment variables**
Create a `.env` file in the server folder:
```env
# Database
MSSQL_DATABASE=your_database_name
MSSQL_SERVER=your_database_server
MSSQL_USERNAME=your_username
MSSQL_PASSWORD=your_password

# JWT
JWT_SECRET="your_jwt_secret_key"

# Server
PORT=your_port_number
NODE_ENV="development"

# CORS
```

Create a `.env` file in the client folder:
```env
# API Base URL
VITE_API_URL=http://localhost:4000/api
VITE_BASE_IMAGE_URL=http://localhost:4000
```

5. **Start the backend server**
```bash
cd server
npm run dev
Server is running on port 4000...
Connected to MSSQL database...
```

7. **Start the frontend application**
```bash
cd client
npm run dev
```

Backend will run at [http://localhost:4000](http://localhost:4000), Frontend at [http://localhost:7000](http://localhost:7000).

## 🏗️ Project Structure

```
pos-system/
├── server/
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── lib/                 # Database and jwt controls
│   │   ├── middlewares/         # Express middleware
│   │   ├── routes/              # API routes
│   │   └── validators/          # Express validator
│   │   └── index.js             
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # Context Api
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Custom axios connection and utils.ts
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx           
│   └── package.json
└── README.md
```

## 📱 Main Pages

- **Dashboard** - Daily sales summary and quick access
- **Sales Screen** - POS terminal interface
- **Product Management** - Product CRUD operations
- **Category Management** - Product categories
- **Customer Management** - Customer records
- **Sales Reports** - Detailed sales analytics
- **Cash Register Management** - Daily cash register operations
- **User Management** - Staff and permission management

## 🔧 Key Features

### Sales Operations
- Fast product search and adding
- Cart management (quantity, discount)
- Multiple payment methods (cash, card, check)
- Automatic receipt printing

### Product Management
- Bulk product import/export
- Category-based filtering
- Stock tracking and alerts
- Image upload support
- Price history

### Reporting
- Daily sales reports
- Best-selling products
- Customer analysis
- Profit-loss calculation
- Excel export feature

### User Authorization
- Admin, Manager, Cashier roles
- Page-based access control
- Transaction logs
- Session management

## 🌐 Deployment

### Production Build
```bash
# Frontend build
cd client
npm run build

# Backend production
cd server
npm run build
npm start
```

## 🔒 Security

- JWT token-based authentication
- Password hashing (bcrypt)
- Rate limiting
- CORS protection
- SQL injection prevention
- XSS protection

## 🤝 Contributing

This project is actively being developed. I welcome your contributions:

1. Fork it
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

For questions:
- You can use GitHub Issues
- Email: emre.ucarr1@gmail.com

---

⭐ Don't forget to star the project if you liked it!

## 🙏 Acknowledgments

This project was developed to meet the needs of modern POS systems. It aims to contribute to the digital transformation of small and medium-sized businesses.
