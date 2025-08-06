import mongoose from "mongoose";

// const cartItemSchema = new mongoose.Schema({
//   movie: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Movie",
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     default: 1,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
// });

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
