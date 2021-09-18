require("dotenv").config();
var mosca = require("mosca");
var settings = { port: 1883 };
var broker = new mosca.Server(settings);
broker.on("ready", () => {
  console.log("broker is ready");
});
const express = require("express");
const cors = require("cors");
const http = require("http");
const socket = require("socket.io");
const pathComp = require("express-static");
const path = require("path");
const authRoutes = require("./routes/auth.js");
const studentRoutes = require("./routes/students.js");
const classRoutes = require("./routes/classRoom.js");
const attendenceRoute = require("./routes/Attendence.js");

require("./db/connectDB");

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", authRoutes);
app.use("/api", studentRoutes);
app.use("/api", classRoutes);
app.use("/api", attendenceRoute);
const root = require("path").join(__dirname, "client", "build");
app.use(express.static(root));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root });
});
const server = http.Server(app);
const io = socket(server, {
  cors: {
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connested", socket.id);
  socket.on("Mark Attendence", (data) => {
    console.log("hi! From server");
    io.emit("Attendence Maked", data);
  });
});

server.listen(port, () => {
  console.log("Server is Running on port :", port);
});
