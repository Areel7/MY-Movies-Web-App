import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const movieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    year: { type: Number, required: true },
    genre: { type: ObjectId, ref: "Genre", required: true },
    detail: { type: String, required: true },
    price: { type: Number},
    cast: [{ type: String }],
    reviews: [reviewSchema],
    numReviews: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
