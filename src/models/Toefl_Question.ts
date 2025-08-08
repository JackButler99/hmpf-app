import mongoose from 'mongoose';

const Toefl_QuestionSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ['reading', 'listening', 'grammar'],
      required: true,
    },

    promptId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'section',
      required: function () {
        return this.section !== 'grammar';
      },
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      validate: [(val: string[]) => val.length === 4, 'Exactly 4 options required'],
      required: true,
    },

    correctAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: true,
    },

    explanation: {
      type: String,
      default: '',
      trim: true,
    },

    question_number: {
      type: Number,
      required: function () {
        return this.section === 'listening';
      },
      min: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Toefl_Question ||
  mongoose.model('Toefl_Question', Toefl_QuestionSchema);
