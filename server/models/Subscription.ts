import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  remainingListings: { type: Number, default: 0 },
  remainingFeatured: { type: Number, default: 0 },
  remainingBumps: { type: Number, default: 0 },
  status: { type: String, enum: ['active','expired','cancelled','pending'], default: 'active' }
});

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
