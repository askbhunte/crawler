const mongoose = require("mongoose");

const ForexSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    base_currency: {
      type: String,
      required: true
    },
    target_currency: {
      type: String,
      required: true
    },
    base_value: {
      type: Number,
      required: true
    },
    buy: {
      type: Number,
      default: null
    },
    sell: {
      type: Number,
      required: true
    }
  },
  {
    collection: "forex",
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

module.exports = mongoose.model("Forex", ForexSchema);
