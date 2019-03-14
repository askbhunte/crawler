const mongoose = require("mongoose");

const HolidaySchema = mongoose.Schema(
  {
    holiday_date: {
      type: String,
      required: true
    },
    holiday_day: {
      type: String,
      required: true
    },
    holiday_desc: {
      type: String,
      required: true
    }
  },
  {
    collection: "holidays",
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

module.exports = mongoose.model("Holiday", HolidaySchema);
