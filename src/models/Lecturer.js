// src/models/Lecturer.js
import mongoose from "mongoose";

const lecturerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Sesuai JSON dari database
    phones: {
      type: [String],
      default: [],
    },

    research_fields: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "lecturers", // ⭐ MATCH dengan nama koleksi di MongoDB
  }
);

// Hindari recompile model
const Lecturer =
  mongoose.models.Lecturer || mongoose.model("Lecturer", lecturerSchema);

export default Lecturer;
