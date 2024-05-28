import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const clientSchema = new mongoose.Schema({
  job_number: {
    type: String,
    unique: true,
    required: true,
  },
  job_name: {
    type: String,
    required: true,
  },
  job_address: {
    type: String,
    required: true,
  },
  tickets: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tickets",
      },
    ],
    default: [],
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
});

clientSchema.plugin(mongoosePaginate);

export const clientModel = mongoose.model("clients", clientSchema);
