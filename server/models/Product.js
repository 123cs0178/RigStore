import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "PC Components",
        "Laptops",
        "Monitors",
        "Keyboards",
        "Mouse",
        "Headphones",
        "Gaming Chairs",
        "Tablets",
        "Smart Watches",
        "Other Electronics",
      ],
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number, // optional, shown as "was ₹X now ₹Y"
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    images: [
      {
        type: String, // URLs, will come from Cloudinary later
      },
    ],
    specifications: {
      type: Map,
      of: String, // e.g. { "RAM": "16GB", "Socket": "AM5" } — flexible per category
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // admin must approve before it's publicly visible
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;