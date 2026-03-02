import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,

      unique: true,
    },
    price: {
      type: Number,
    },
    brand: {
      type: String,
    },
    color: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    description: {
      type: String,

      trim: true,
    },
    offer: { type: Number },
    mainImages: [{ img: { type: String } }],

    productPictures: [{ img: { type: String } }],

    ratings: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
    },
    createdBy: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    visibility: {
      type: String,
      required: true,
      trim: true,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
