import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const ticketSchema = new mongoose.Schema({
  ticket_id: {
    type: Number,
    required: true,
    unique: true,
  },
  ticket_status: {
    type: String,
    enum: ["Open", "In progress", "Closed"],
    default: "Open",
    index: true,
  },
  ticket_createdAt: {
    type: Date,
    default: () => {
      const date = new Date();
      const gmtMinus3Offset = -3 * 60;
      date.setMinutes(date.getMinutes() + gmtMinus3Offset);
      return date;
    },
  },
  job_data: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "clients",
    required: true,
  },
  number_ele_esc: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  description: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    default: "",
  },
  status_ele_esc: {
    type: String,
    enum: ["Out of service", "In service"],
    default: "Out of service",
  },
  rt: {
    type: String,
    default: "",
  },
  files: [
    {
      filename: { type: String, required: true },
      path: { type: String, required: true },
      filetype: { type: String, required: true },
    },
  ],
});
ticketSchema.plugin(mongoosePaginate);

export const ticketModel = mongoose.model("tickets", ticketSchema);
