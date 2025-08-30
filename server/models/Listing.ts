import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    area: String,
    pincode: String
  },
  images: [{ type: String }],
  condition: String,
  brand: String,
  model: String,
  year: Number,
  km: Number,
  bedrooms: Number,
  bathrooms: Number,
  negotiable: { type: Boolean, default: false },
  tags: [{ type: String }],
  status: {
    type: String,
    enum: ['draft','pending','active','sold','rejected','expired'],
    default: 'draft'
  },
  isFeatured: { type: Boolean, default: false },
  isUrgent: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  favoritesCount: { type: Number, default: 0 },
  rejectionReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

listingSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  this.updatedAt = new Date();
  next();
});

export const Listing = mongoose.model('Listing', listingSchema);
