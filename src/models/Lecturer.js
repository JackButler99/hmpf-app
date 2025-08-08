// src/models/Lecturer.js
import mongoose from 'mongoose';

const lecturerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: false }
});

// ✅ Use existing model if already compiled
const Lecturer = mongoose.models.Lecturer || mongoose.model('Lecturer', lecturerSchema);

export default Lecturer;
