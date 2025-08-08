import mongoose from 'mongoose';

const ReadingPromptSchema = new mongoose.Schema({
  section: { type: String, default: 'reading' },
  title: { type: String },
  passage: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.ReadingPrompt || mongoose.model('ReadingPrompt', ReadingPromptSchema);
