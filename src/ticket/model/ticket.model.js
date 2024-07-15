import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { getGMTMinus3Date, getDateGMT } from "../../utils/time.util.js";

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
  ticket_date: {
    type: Date,
    default: () => {
      const gmtMinus3 = getDateGMT();
      return gmtMinus3;
    },
  },
  ticket_createdAt: {
    type: String,
    default: () => {
      const gmtMinus3Date = getGMTMinus3Date();
      return gmtMinus3Date;
    },
  },
  ticket_assignedAt: {
    type: String,
    default: () => {
      return "";
    },
  },
  ticket_workingAt: {
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
    enum: ["Fuera de servicio", "En servicio"],
    default: "Fuera de servicio",
    index: true,
  },
  rt: {
    type: String,
    default: "",
  },
  contact: {
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
