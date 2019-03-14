const mongoose = require("mongoose");

const NewsSchema = mongoose.Schema(
  {
    source: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    headline: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    img: {
      type: String,
      default: null
    },
    desc: {
      type: String,
      required: true
    }
  },
  {
    collection: "news",
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

module.exports = mongoose.model("News ", NewsSchema);
