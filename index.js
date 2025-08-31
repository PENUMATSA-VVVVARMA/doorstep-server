require('dotenv').config(); //loading the .env file attributes
const PORT = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');
const dbconnect = require('./db/connectdb');

// Import all routes
const paymentsRoutes = require('./routes/paymentsRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/Productroutes');
const orderRoutes = require('./routes/Orderroutes');
const userRoutes = require('./routes/Usersroutes');

const app = express();

//connecting with the database
dbconnect();

// Middleware
app.use(cors());
app.use(express.json());

// Root status route
app.get('/', (req, res) => {
  res.json({
    message: 'Doorstep E-commerce API Server is running!',
    status: 'Active',
    endpoints: {
      auth: '/api/auth (login, register)',
      payments: '/api/payments (CRUD)',
      products: '/api/products (CRUD)',
      orders: '/api/orders (CRUD)',
      users: '/api/users (CRUD)'
    },
    version: '1.0.0'
  });
});

//routes
app.use('/api/payments', paymentsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

//starting the server
app.listen(PORT, () => {
    console.log(`🚀 Doorstep E-commerce Server is running on http://localhost:${PORT}`);
    console.log(`📊 Database: Connected`);
    console.log(`🔗 API Endpoints:`);
    console.log(`   • GET / - Server status`);
    console.log(`   • /api/auth - Authentication`);
    console.log(`   • /api/payments - Payment CRUD`);
    console.log(`   • /api/products - Product CRUD`);
    console.log(`   • /api/orders - Order CRUD`);
    console.log(`   • /api/users - User CRUD`);
});