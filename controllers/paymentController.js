const Payment = require('../models/PaymentSchema');

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const newPayment = new Payment(req.body);
    await newPayment.save(); //commit or making permanent of changes
    
    res.status(201).json({
      message: 'Payment created successfully',
      payment: newPayment
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('orderId', 'orderNumber totalAmount')
      .populate('userId', 'name email'); //request parameter is optional
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('orderId', 'orderNumber totalAmount')
      .populate('userId', 'name email');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update payment
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    res.json({
      message: 'Payment updated successfully',
      payment
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
