const express = require("express");
const router = express.Router();
const { authFunc } = require("../middleware/auth");

const { getAllClassRoom, newClassRoom } = require("../controllers/classRoom");
router.post("/getAllClassRoom", authFunc, getAllClassRoom);
router.post("/newClassRoom", authFunc, newClassRoom);

module.exports = router;
