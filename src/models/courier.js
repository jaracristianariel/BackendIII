import mongoose from "mongoose";

// Modelo de Courier (repartidor).
const courierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  zone: { type: String, required: true },
  available: { type: Boolean, default: true },
});

export default mongoose.model("Courier", courierSchema);