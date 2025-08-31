const express = require('express');
const router = express.Router();
const { 
  createPayment, 
  getPayments, 
  getPaymentById, 
  updatePayment, 
  deletePayment 
} = require('../controllers/paymentController');

// Route to get all payments
router.get('/', getPayments);

// Route to get payment by ID
router.get('/:id', getPaymentById);

// Route to create a new payment
router.post('/', createPayment);

// Route to update payment
router.put('/:id', updatePayment);

// Route to delete payment
router.delete('/:id', deletePayment);

module.exports = router;
