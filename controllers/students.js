const Student = require("../models/student");
const { v4: uuidv4 } = require("uuid");
const MqttHandler = require("../mqtt/mqtt");
const student = require("../models/student");
const client = new MqttHandler();
client.connect();
const db = require("../db/connectDB");

exports.getAllStudents = async (req, res) => {
  await db.connection.query(`Select * From students;`, (err, results) => {
    if (err) {
      return res.json({
        message: "Error " + e + "Contact Your Administrator ",
      });
    }
    return res.json({ data: results });
  });
};
exports.newStudent = async (req, res) => {
  const { name, classRoom } = req.body;
  let data = { id: uuidv4(), studentName: name, department: classRoom };

  await db.connection.query(
    `INSERT INTO students (id,studentName,departmentName) VALUES ("${data.id}","${data.studentName}","${data.department}");`,
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          message: "Error " + err + "Contact Your Administrator ",
        });
      }
      client.sendMessage("S1001/Places/Indoor/School/NeMember", data.id);
      return res.json({ data, message: "Student Added" });
    }
  );
};
exports.deleteStudent = async (req, res) => {
  const { id } = req.body;
  await db.connection.query(
    `DELETE FROM students WHERE (id = '${id}');`,
    async (err, results) => {
      if (err) {
        console.log(err);
        return res.json({
          message: "Error " + err + "Contact Your Administrator ",
        });
      }
      client.sendMessage("S1001/Places/Indoor/School/DeleteMember", id);
      return res.json({ message: "Student Deleted" });
    }
  );
};
