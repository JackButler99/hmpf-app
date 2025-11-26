import mongoose, { Schema } from "mongoose";

const SimulationSessionSchema = new Schema(
  {
    userId: { type: String, required: true },
    mode: {
      type: String,
      enum: ["full", "listening", "structure", "reading"],
      required: true,
    },
    currentQuestion: { type: Number, default: 0 },
    answers: { type: Object, default: {} },
    expiresAt: { type: Date, index: { expires: "3h" } },
  },
  { timestamps: true }
);

export default mongoose.models.SimulationSession ||
  mongoose.model("SimulationSession", SimulationSessionSchema);
