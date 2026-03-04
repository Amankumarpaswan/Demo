import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema({
  names: { type: String, required: true },
  category: { type: String, required: true },
  photos: [String], // Array of photo URLs
  musicUrl: String,
  customMessage: String,
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 86400 // ✅ 86400 Seconds = 24 Hours (Auto Delete Magic)
  }
});

// Prevent overwrite error in Next.js
export default mongoose.models.Story || mongoose.model('Story', StorySchema);