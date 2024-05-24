import mongoose from "mongoose";

export const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  purchase_datatime: { type: Date, default: Date.now },
  amount: Number,
  purchaser: String,
});

export const ticketModel = mongoose.model("tickets", ticketSchema);
