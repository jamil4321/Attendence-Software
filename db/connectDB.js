// const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost:27017/att_ms", {
//     useNewUrlParser: true,
//     useFindAndModify: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   })
//   .then(() => console.log("DB Connect established"))
//   .catch((err) => console.log("DB Conection error: ", err));

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Attendence",
});
connection.connect((err) => {
  if (err) {
    console.log("Error", err);
    return null;
  }
  console.log("Database Connected");
});

const queryForTable = async (sql) => {
  // const [results] =
  connection.query(sql, (error, results, fields) => {
    if (error) {
      console.log(error);
      return null;
    }
    console.log(results);
  });
};

const createTables = () => {
  queryForTable(`create table if not exists users(
                          id int primary key auto_increment,
                          name varchar(255) not null,
                          email varchar(255) not null,
                          password varchar(255) not null
                      )`);
  queryForTable(`create table if not exists students(
                          id int primary key auto_increment,
                          studentName varchar(255) not null
                      )`);
  queryForTable(`create table if not exists studentLogs(
                          id int primary key auto_increment,
                          studentId varchar(255) not null,
                          studentName varchar(255) not null,
                          camera varchar(255) not null,
                          timeDate DATETIME not null
                      )`);
  queryForTable(`create table if not exists attLogs(
                          id int primary key auto_increment,
                          studentId varchar(255) not null,
                          timeDate DATETIME not null
                      )`);
  queryForTable(`create table if not exists attendence(
                          id int primary key auto_increment,
                          studentId varchar(255)not null,
                          studentName varchar(255) not null,
                          Attendence varchar(255) not null,
                          timeDate DATETIME not null
                      )`);
  queryForTable(`create table if not exists department(
                          id int primary key auto_increment,
                          department varchar(255)not null
                      )`);
};
createTables();
module.exports = { connection };
