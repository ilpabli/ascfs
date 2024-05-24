import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema({
  products: {
    default: [],
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number,
      },
    ],
  },
});

export const cartModel = mongoose.model("carts", cartSchema);
