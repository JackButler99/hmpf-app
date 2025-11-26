import mongoose from 'mongoose';

const ReadingPromptSchema = new mongoose.Schema({
  section: { type: String, default: 'reading', required: true },
  title: { type: String },
  passage: { type: String, required: true },
  passageNumber: { type: Number, required: true, default: 1 },
}, { timestamps: true });

export default mongoose.models.ReadingPrompt || mongoose.model('ReadingPrompt', ReadingPromptSchema);

