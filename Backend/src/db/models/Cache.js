import mongoose from 'mongoose';

const cacheSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 3600000), // 1 hour expiry
    expires: 3600 // MongoDB TTL index (in seconds)
  }
});

export const Cache = mongoose.model('Cache', cacheSchema);
