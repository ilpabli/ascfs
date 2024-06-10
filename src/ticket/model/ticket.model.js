import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { format } from "date-fns";

export const ticketSchema = new mongoose.Schema({
  ticket_id: {
    type: Number,
    required: true,
    unique: true,
  },
  ticket_status: {
    type: String,
    enum: ["Abierto", "En proceso", "Cerrado"],
    default: "Abierto",
    index: true,
  },
  ticket_createdAt: {
    type: String, 
    default: () => {
      const date = new Date();
      date.setMinutes(date.getMinutes());
      return format(date, "HH:mm yyyy-MM-dd");
    },
  },
  ticket_assignedAt: {
    type: String,
    default: () => {
      return "";
    },
  },
  ticket_closedAt: {
    type: String,
    default: () => {
      return "";
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
  ele_esc: {
    type: String,
    enum: ["Ascensor", "Escalera"],
    default: "Ascensor",
    index: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  assigned_to: {
    type: String,
    default: "",
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
    enum: ["Fuera de servicio", "En servicio"],
    default: "Fuera de servicio",
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
