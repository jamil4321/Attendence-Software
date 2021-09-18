const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  newStudent,
  deleteStudent,
} = require("../controllers/students");
router.post("/getAllStudents", getAllStudents);
router.post("/newStudent", newStudent);
router.post("/deleteStudent", deleteStudent);
module.exports = router;
