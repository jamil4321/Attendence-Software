const mongoose = require("mongoose");

const classRoomSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    classRoomName: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("classroom", classRoomSchema);
