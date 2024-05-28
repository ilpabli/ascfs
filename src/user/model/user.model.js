import mongoose from "mongoose";

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
    unique: true,
    required: false,
    default: "",
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
    type: Date,
    default: () => {
      const date = new Date();
      const gmtMinus3Offset = -3 * 60;
      date.setMinutes(date.getMinutes() + gmtMinus3Offset);
      return date;
    },
  },
});

export const userModel = mongoose.model("users", userSchema);
