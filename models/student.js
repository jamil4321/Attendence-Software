const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 64,
    },
    classRoom: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("students", studentSchema);
