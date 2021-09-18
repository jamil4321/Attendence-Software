const express = require("express");
const router = express.Router();
const { authFunc } = require("../middleware/auth");

const {
  markAttendence,
  getAttendence,
  ViewStudentsLogs,
} = require("../controllers/attendence");
router.post("/markAttendence", markAttendence);
router.post("/getattendence", getAttendence);
router.post("/ViewStudentsLogs", ViewStudentsLogs);

module.exports = router;
