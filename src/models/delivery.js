import mongoose from "mongoose";

// Modelo de Delivery (entrega: vincula un Order con un Courier).
const deliverySchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  courierId: { type: mongoose.Schema.Types.ObjectId, ref: "Courier" },
  status: { type: String, default: "assigned" }, // assigned | in_transit | delivered
  assignedAt: { type: Date, default: Date.now },
  receipt: {
    originalName: { type: String },
    generatedName: { type: String },
    path: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    uploadedAt: { type: Date },
  },
});

export default mongoose.model("Delivery", deliverySchema);