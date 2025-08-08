import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isEditor: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // ✅ this automatically adds createdAt and updatedAt
  }
);

const User = models.User || model('User', UserSchema);

export default User;
