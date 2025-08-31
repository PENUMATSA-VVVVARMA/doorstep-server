const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cash_on_delivery'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'paytm', 'phonepe', 'googlepay'],
    required: function() {
      return this.paymentMethod !== 'cash_on_delivery';
    }
  },
  gatewayTransactionId: {
    type: String
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  failureReason: {
    type: String
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: {
    type: Date
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  cardDetails: {
    last4Digits: String,
    cardType: {
      type: String,
      enum: ['visa', 'mastercard', 'rupay', 'amex']
    },
    expiryMonth: Number,
    expiryYear: Number
  }
}, {
  timestamps: true
});

// Generate transaction ID before saving
PaymentSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);
