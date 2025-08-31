import mongoose from 'mongoose';

const gatewaySchema = new mongoose.Schema({
  provider: { type: String, enum: ['razorpay', 'phonepe', 'stripe', 'paytm', 'manual'], required: true },
  name: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  isDefault: { type: Boolean, default: false },
  // Credentials are stored encrypted/base64 depending on server secret availability
  credentials: { type: mongoose.Schema.Types.Mixed, default: {} },
  public: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export const Gateway = mongoose.model('Gateway', gatewaySchema);
