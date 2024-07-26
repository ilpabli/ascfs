import mongoose from "mongoose";
import { getDateGMT } from "../../utils/time.util.js";
import mongoosePaginate from "mongoose-paginate-v2";

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
    index: true,
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
    type: Date,
    default: () => {
      const gmtMinus3 = getDateGMT();
      return gmtMinus3;
    },
  },
  last_location_update: {
    type: Date,
  },
});
userSchema.plugin(mongoosePaginate);

export const userModel = mongoose.model("users", userSchema);
