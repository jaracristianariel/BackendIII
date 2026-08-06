import mongoose from "mongoose";
import { USER_ROLES } from "../constants/index.js";

// Modelo de User (cliente).
const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: USER_ROLES.USER }, 
});

export default mongoose.model("User", userSchema);