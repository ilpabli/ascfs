import mongoose from "mongoose";
import { format } from "date-fns";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  user: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  email: {
    type: String,
  },
  password: String,
  tickets: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tickets",
      },
    ],
    default: [],
  },
  img: String,
  role: {
    type: String,
    enum: ["user", "admin", "supervisor", "technician", "receptionist"],
    default: "user",
  },
  gps_point: {
    lat: {
      type: Number,
      default: -34.6129498,
    },
    lng: {
      type: Number,
      default: -58.3785604,
    },
  },
  last_connection: {
    type: String,
    default: () => {
      const date = new Date();
      date.setMinutes(date.getMinutes());
      return format(date, "HH:mm yyyy-MM-dd");
    },
  },
});

export const userModel = mongoose.model("users", userSchema);
