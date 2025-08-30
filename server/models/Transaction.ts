import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  orderId: String,
  paymentId: String,
  status: { type: String, enum: ['created','paid','failed','refunded'], default: 'created' },
  method: String,
  invoiceUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
