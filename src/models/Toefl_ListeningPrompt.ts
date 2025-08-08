import mongoose from 'mongoose';

const ListeningPromptSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      default: 'listening',
      enum: ['listening'], // explicitly enforce only 'listening'
      immutable: true,
    },

    audioUrl: {
      type: String,
      required: true,
      trim: true,
    },

    transcript: {
      type: String,
      default: '',
      trim: true,
    },

    title: {
      type: String,
      default: '',
      trim: true,
    },

    instruction: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ListeningPrompt ||
  mongoose.model('ListeningPrompt', ListeningPromptSchema);
