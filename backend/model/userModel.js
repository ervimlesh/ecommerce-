// models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  answer: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0, // 0 = User, 1 = Admin, 2 = Super Admin
  },
});

export default mongoose.model("User", userSchema); // ✅ Correct ref name
