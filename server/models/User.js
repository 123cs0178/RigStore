import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // hashed, never plain text
    },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    // Seller-specific fields (only relevant if role === "seller")
    sellerStatus: {
      type: String,
      enum: ["not_applied", "pending", "approved", "rejected"],
      default: "not_applied",
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const User = mongoose.model("User", userSchema);

export default User;