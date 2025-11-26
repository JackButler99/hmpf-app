import mongoose, { Schema } from "mongoose";

const Toefl_SimulationHistorySchema = new Schema(
  {
    userId: { type: String, required: true },

    mode: {
      type: String,
      enum: ["full", "reading", "listening", "structure"],
      required: true,
    },

    score: {
      listening: { type: Number, default: 0 },
      structure: { type: Number, default: 0 },
      reading: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },

    questions: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Toefl_Question",
          required: true,
        },

        promptId: {
          type: Schema.Types.ObjectId,
          required: false,
        },

        section: {
          type: String,
          enum: ["reading", "listening", "grammar"],
          required: true,
        },

        userAnswer: { type: String, default: null },
        correctAnswer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },

        explanation: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Toefl_SimulationHistory ||
  mongoose.model("Toefl_SimulationHistory", Toefl_SimulationHistorySchema);
