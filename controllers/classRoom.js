const classRoom = require("../models/classRoom");
const { v4: uuidv4 } = require("uuid");

exports.getAllClassRoom = async (req, res) => {
  classRoom
    .find({})
    .then((data) => {
      return res.json({ data });
    })
    .catch((e) => {
      return res.json({
        message: "Error " + e + "Contact Your Administrator ",
      });
    });
};
exports.newClassRoom = async (req, res) => {
  const { classRoomName } = req.body;
  const newClass = new classRoom({
    id: uuidv4(),
    classRoomName,
  });
  newClass
    .save()
    .then((data) => {
      return res.json({ data, message: "Class Room Added SuccessFully" });
    })
    .catch((e) => {
      return res.json({
        message: "Error " + e + "Contact Your Administrator ",
      });
    });
};
