import mongoose from "mongoose";

const Toefl_QuestionSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["reading", "listening", "grammar"],
      required: true,
    },

    // Tidak pakai refPath, bikin lebih aman
    promptId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      validate: [
        (val: string[]) => val.length === 4,
        "Exactly 4 options required",
      ],
      required: true,
    },

    correctAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    question_number: {
      type: Number,
      min: 1,
      default: null, // TS friendly
    },
  },
  { timestamps: true }
);

export default mongoose.models.Toefl_Question ||
  mongoose.model("Toefl_Question", Toefl_QuestionSchema);
