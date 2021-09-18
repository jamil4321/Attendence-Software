const mongoose = require("mongoose");

const attendenLogceSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      trim: true,
      required: true,
    },
    wdate: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("logAtt", attendenLogceSchema);
