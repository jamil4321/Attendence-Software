const mongoose = require("mongoose");

const attendenceSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      trim: true,
      required: true,
    },
    studenName: {
      type: String,
      trim: true,
      required: true,
    },
    classRoom: {
      type: String,
      trim: true,
      required: true,
    },
    wdate: Date,
    Attendence: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("attendence", attendenceSchema);
