import mongoose, { Schema } from "mongoose";

const SimulationScoreSchema = new Schema(
  {
    userId: { type: String, required: true },
    mode: { type: String, required: true },
    score: { type: Number, required: true },
    breakdown: {
      listening: Number,
      structure: Number,
      reading: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.models.SimulationScore ||
  mongoose.model("SimulationScore", SimulationScoreSchema);
