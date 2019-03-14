const mongoose = require("mongoose");

const BullionSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    rate: {
      type: String,
      required: true
    },
    image_url: {
      type: String
    },
    date: {
      type: Date
    }
  },
  {
    collection: "bullions",
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

module.exports = mongoose.model("Bullion", BullionSchema);
