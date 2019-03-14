const mongoose = require("mongoose");

const FlightSchema = mongoose.Schema(
  {
    plane_code: {
      type: String,
      required: true
    },
    link: {
      type: String
    },
    flight_status: {
      type: String
    },
    arrival: {
      type: String
    },
    origin: {
      type: String,
      default: null
    },
    departure: {
      type: String,
      default: null
    },
    destination: {
      type: String,
      default: null
    }
  },
  {
    collection: "flights",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    toObject: {
      virtuals: true
    },
    toJson: {
      virtuals: true
    }
  }
);

module.exports = mongoose.model("Flight", FlightSchema);
