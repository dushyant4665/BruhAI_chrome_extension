
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
    index: { expires: '1h' }
  }
});

// For models, named export is okay since we're exporting a constant
export const Cache = mongoose.model('Cache', cacheSchema);