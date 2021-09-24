const classRoom = require("../models/classRoom");
const { v4: uuidv4 } = require("uuid");
const db = require("../db/connectDB");

exports.getAllClassRoom = async (req, res) => {
  // classRoom
  //   .find({})
  //   .then((data) => {
  //     return res.json({ data });
  //   })
  //   .catch((e) => {
  //     return res.json({
  //       message: "Error " + e + "Contact Your Administrator ",
  //     });
  //   });

  await db.connection.query(`Select * From department;`, (err, results) => {
    if (err) {
      return res.json({
        message: "Error " + e + "Contact Your Administrator ",
      });
    }
    return res.json({ data: results });
  });
};
exports.newClassRoom = async (req, res) => {
  const { classRoomName } = req.body;
  const newClass = {
    id: uuidv4(),
    classRoomName,
  };
  await db.connection.query(
    `INSERT INTO department (id,department) VALUES ("${newClass.id}","${newClass.classRoomName}");`,
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          message: "Error " + err + "Contact Your Administrator ",
        });
      }
      return res.json({ data: newClass, message: "Department Added" });
    }
  );
};
