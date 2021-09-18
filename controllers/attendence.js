const Attendence = require("../models/attendence");
const Students = require("../models/student");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const db = require("../db/connectDB");

const csvWriter = createCsvWriter({
  path: "out.csv",
  header: [
    { id: "AcNo", title: "Ac-No" },
    { id: "Name", title: "Name" },
    { id: "sTime", title: "sTime" },
    { id: "VerifyMode", title: "Verify Mode" },
    { id: "Machine", title: "Machine" },
    { id: "Exception", title: "Exception" },
    { id: "checktype", title: "checktype" },
    { id: "sensorid", title: "sensorid" },
    { id: "workcode", title: "workcode" },
    { id: "sDate", title: "sDate" },
  ],
});
// const csvWriter = createCsvWriter({
//   path: 'out.csv',
//   header: [
//     {id: 'name', title: 'Name'},
//     {id: 'surname', title: 'Surname'},
//     {id: 'age', title: 'Age'},
//     {id: 'gender', title: 'Gender'},
//   ]
// });
const pad = (num) => {
  return ("00" + num).slice(-2);
};

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth()
  );
}

exports.getAttendence = async (req, res) => {
  const { startDate, endDate } = req.body;
  console.log(startDate, endDate);
  let start = new Date(new Date(startDate).setHours(00, 00, 00));
  console.log(start, "Start Date");
  let getStartDate =
    start.getFullYear() +
    "-" +
    pad(start.getMonth() + 1) +
    "-" +
    pad(start.getDate()) +
    " " +
    pad(start.getHours()) +
    ":" +
    pad(start.getMinutes()) +
    ":" +
    pad(start.getSeconds());
  let end = new Date(new Date(endDate).setHours(23, 59, 59));
  console.log(end, "End Date");
  let getEndDate =
    end.getFullYear() +
    "-" +
    pad(end.getMonth() + 1) +
    "-" +
    pad(end.getDate()) +
    " " +
    pad(end.getHours()) +
    ":" +
    pad(end.getMinutes()) +
    ":" +
    pad(end.getSeconds());
  await db.connection.query(
    `select * from attendence 
    where timeDate >= "${getStartDate}" AND timeDate <= "${getEndDate}"
    `,
    (err, results) => {
      if (err) {
        return res.json({ message: "Error" + err });
      }
      return res.json({ data: results });
    }
  );
  // let data = await Attendence.find({
  //   wdate: {
  //     $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
  //     $lt: new Date(new Date(endDate).setHours(23, 59, 59)),
  //   },
  // }).sort({ wdate: "asc" });

  // return res.json({ data: data });
};

exports.markAttendence = async (req, res) => {
  let { studentID, cameraID } = req.body;
  let alreadyAttendenceMark = false;
  await db.connection.query(
    `select * from attendence where studentId = "${studentID}"`,
    async (err, results) => {
      if (err) {
        return res.json({ message: "Error" + err });
      }
      if (results.length > 0) {
        console.log("Already Mark");
        for (let found of results) {
          let checkDate = isSameDay(new Date(found.timeDate), new Date());
          if (checkDate) {
            alreadyAttendenceMark = true;
            break;
          }
        }
        if (alreadyAttendenceMark === false) {
          await db.connection.query(
            `select * from students where id = "${studentID}"`,
            async (err, results) => {
              if (err) {
                return res.json({ message: "Error" + err });
              }
              if (results.length > 0) {
                console.log(results[0]);
                await db.connection.query(
                  `INSERT INTO attendence (studentId,studentName,Attendence) VALUES ("${studentID}","${results[0].studentName}","P")`,
                  async (err, results) => {
                    if (err) {
                      return res.json({ message: "Error" + err });
                    }
                    await db.connection.query(
                      `INSERT INTO studentlogs (studentId,studentName,camera) VALUES ("${studentID}","${results[0].studentName}","${cameraID}")`,
                      async (err, results) => {
                        if (err) {
                          return res.json({ message: "Error" + err });
                        }
                        console.log("data inserted");
                      }
                    );
                    return res.json({
                      message: "attendence mark for " + studentID,
                    });
                  }
                );
              } else {
                return res.json({ message: "Student Id Not Found" });
              }
            }
          );
        } else {
          await db.connection.query(
            `INSERT INTO studentlogs (studentId,studentName,camera) VALUES ("${studentID}","${results[0].studentName}","${cameraID}")`,
            async (err, results) => {
              if (err) {
                return res.json({ message: "Error" + err });
              }
              console.log("data inserted");
            }
          );
          return res.json({ message: "Already Mark", data: results });
        }
      } else {
        await db.connection.query(
          `select * from students where id = "${studentID}"`,
          async (err, results) => {
            if (err) {
              return res.json({ message: "Error" + err });
            }
            if (results.length > 0) {
              let dateTime = new Date();
              await db.connection.query(
                `INSERT INTO attendence (studentId,studentName,Attendence) VALUES ("${results[0].id}","${results[0].studentName}","P")`,
                async (err, resul) => {
                  if (err) {
                    return res.json({ message: "Error" + err });
                  }
                  await db.connection.query(
                    `INSERT INTO studentlogs (studentId,studentName,camera) VALUES ("${studentID}","${results[0].studentName}","${cameraID}")`,
                    async (err, results) => {
                      if (err) {
                        return res.json({ message: "Error" + err });
                      }
                    }
                  );
                  return res.json({
                    message: "attendence mark for " + studentID,
                  });
                }
              );
            } else {
              return res.json({ message: "Student Id Not Found" });
            }
          }
        );
      }
    }
  );
};

exports.ViewStudentsLogs = async (req, res) => {
  const { startDate, endDate } = req.body;
  console.log(startDate, endDate);
  let start = new Date(new Date(startDate).setHours(00, 00, 00));
  console.log(start, "Start Date");
  let getStartDate =
    start.getFullYear() +
    "-" +
    pad(start.getMonth() + 1) +
    "-" +
    pad(start.getDate()) +
    " " +
    pad(start.getHours()) +
    ":" +
    pad(start.getMinutes()) +
    ":" +
    pad(start.getSeconds());
  let end = new Date(new Date(endDate).setHours(23, 59, 59));
  console.log(end, "End Date");
  let getEndDate =
    end.getFullYear() +
    "-" +
    pad(end.getMonth() + 1) +
    "-" +
    pad(end.getDate()) +
    " " +
    pad(end.getHours()) +
    ":" +
    pad(end.getMinutes()) +
    ":" +
    pad(end.getSeconds());
  await db.connection.query(
    `select * from studentlogs 
    where timeDate >= "${getStartDate}" AND timeDate <= "${getEndDate}"
    `,
    (err, results) => {
      if (err) {
        return res.json({ message: "Error" + err });
      }
      return res.json({ data: results });
    }
  );
};
