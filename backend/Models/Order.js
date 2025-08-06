import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    cardNumber: { type: String, required: true },
    date: { type: Date, default: Date.now },
    zip: { type: Number, required: true },
    items: [
      {
        name: { type: String },
        price: { type: Number },
        genre: { type: String },
        quantity: { type: Number },
      },
    ],
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
