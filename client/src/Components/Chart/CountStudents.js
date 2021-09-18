import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Typography, Grid } from "@material-ui/core";
import Countup from "react-countup";
import { Doughnut, Bar } from "react-chartjs-2";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: 400,
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const CountStudents = (props) => {
  const { students } = useSelector((state) => {
    return {
      students: state.students,
    };
  });
  const filterStudent = students.filter((data) => {
    if (props.classRoom === "All") {
      return data;
    } else if (data.classRoom === props.classRoom) {
      return data;
    }
  });
  return (
    <Card style={{ textAlign: "center" }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Total Students
        </Typography>
        <Typography variant="h5">
          <Countup
            start={0}
            end={filterStudent.length}
            duration={2.5}
            separator=","
          />
        </Typography>
      </CardContent>
    </Card>
  );
};

export const CountPresentStudent = (props) => {
  const { students, attendence } = useSelector((state) => {
    return {
      students: state.students,
      attendence: state.attendence,
    };
  });
  let dataCount = 0;

  console.log("attendence count", attendence);
  const filterStudent = students.filter((data) => {
    attendence.map((att) => {
      let date1 = props.startDate;
      let date2 = props.endDate;
      console.log(date1, date2);
      let diffrentTime = date2.getTime() - date1.getTime();
      let days = diffrentTime / (1000 * 3600 * 24) + 1;
      for (let i = 0; i < days; i++) {
        let date = new Date(
          new Date(date1).setDate(new Date(date1).getDate() + i)
        );
        let attDate = new Date(att.timeDate.split("T")[0]);
        console.log(attDate, "attendence Date");
        let check = props.isSameDayfunc(attDate, date);
        console.log(check);
        if (check === true) {
          if (data.id === att.studentId) {
            dataCount = dataCount + 1;
            console.log(dataCount);
          }
        }
      }
    });
    // console.log(dataReturn);
  });
  console.log(filterStudent, "filter present", dataCount);
  return (
    <Card style={{ textAlign: "center" }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {props.classRoom === "All"
            ? "Total Student Present in University"
            : "Total Student Present in ClassRoom"}
        </Typography>
        <Typography variant="h5">
          <Countup start={0} end={dataCount} duration={2.5} separator="," />
        </Typography>
      </CardContent>
    </Card>
  );
};

export const CountAbsentStudent = (props) => {
  const { students, attendence } = useSelector((state) => {
    return {
      students: state.students,
      attendence: state.attendence,
    };
  });
  let dataCount = 0;
  console.log("Absent count", attendence);
  const filterStudent = students.filter((data) => {
    attendence.map((att) => {
      let date1 = props.startDate;
      let date2 = props.endDate;
      let diffrentTime = date2.getTime() - date1.getTime();
      let days = diffrentTime / (1000 * 3600 * 24);
      console.log(days, "days");
      for (let i = 0; i < days + 1; i++) {
        let date = new Date(
          new Date(date1).setDate(new Date(date1).getDate() + i)
        );
        let attDate = new Date(att.timeDate.split("T")[0]);
        let check = props.isSameDayfunc(attDate, date);
        if (check === true) {
          console.log(data.id, att.studentId);
          if (data.id !== att.studentId) {
            dataCount = dataCount + 1;
          }
        }
      }
    });
    // console.log(dataReturn);
    // return dataReturn;
  });
  console.log(filterStudent, "filter Absent in University", dataCount);
  return (
    <Card style={{ textAlign: "center" }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {props.classRoom === "All"
            ? "Total Student Absent in University"
            : "Total Student Absent in ClassRoom"}
        </Typography>
        <Typography variant="h5">
          <Countup
            start={0}
            end={dataCount === 0 ? 0 : students.length - dataCount}
            duration={2.5}
            separator=","
          />
        </Typography>
      </CardContent>
    </Card>
  );
};

export const MostPresentsInUniversity = (props) => {
  const { students, attendence } = useSelector((state) => {
    return {
      students: state.students,
      attendence: state.attendence,
    };
  });
  let studentName = [];
  if (props.classRoom === "All") {
    studentName = [
      ...attendence
        .reduce((mp, o) => {
          if (!mp.has(o.studentId))
            mp.set(o.studentId, {
              ...o,
              count: 0,
            });
          mp.get(o.studentId).count++;
          return mp;
        }, new Map())
        .values(),
    ];
  }
  console.log("attendence count", attendence);
  console.log("filter", studentName);
  studentName
    .sort(function (a, b) {
      return b.count - a.count;
    })
    .slice(0, 4);
  console.logs(studentName);
  return (
    <Card style={{ textAlign: "center" }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {props.classRoom === "All"
            ? "Most Present in University"
            : "Most Present in ClassRoom"}
        </Typography>
        {studentName.length > 0 && (
          <Doughnut
            data={{
              labels: studentName.map((data) => data.studenName),
              datasets: [
                {
                  data: studentName.map((data) => data.count),
                  backgroundColor: [
                    "#FF8C00",
                    "green",
                    "red",
                    "#BDB76B",
                    "#2E8B57",
                    "#4682B4",
                    "#00008B",
                    "#DEB887",
                  ],
                  hoverBackgroundColor: [
                    "#FFA500",
                    "lightgreen",
                    "#FF7F7F",
                    "#F0E68C",
                    "#3CB371",
                    "#B0C4DE",
                    "#0000CD",
                    "#F5DEB3",
                  ],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
            }}
          />
        )}
        {/* <Countup
          start={0}
          end={studentName.length}
          duration={2.5}
          separator=","
        /> */}
      </CardContent>
    </Card>
  );
};

export const MostAbsentInUniversity = (props) => {
  let date1 = props.startDate;
  let date2 = props.endDate;
  let diffrentTime = date2.getTime() - date1.getTime();
  let days = diffrentTime / (1000 * 3600 * 24);
  const { students, attendence } = useSelector((state) => {
    return {
      students: state.students,
      attendence: state.attendence,
    };
  });
  let studentName = [];
  if (props.classRoom === "All") {
    studentName = [
      ...attendence
        .reduce((mp, o) => {
          if (!mp.has(o.studentId))
            mp.set(o.studentId, {
              ...o,
              count: 0,
            });
          mp.get(o.studentId).count++;
          return mp;
        }, new Map())
        .values(),
    ];
  } else {
    let filterByClassRoom = attendence.filter((att) =>
      att.classRoom === props.classRoom ? att : null
    );
    studentName = [
      ...filterByClassRoom
        .reduce((mp, o) => {
          if (!mp.has(o.studentId))
            mp.set(o.studentId, {
              ...o,
              count: 0,
            });
          mp.get(o.studentId).count++;
          return mp;
        }, new Map())
        .values(),
    ];
  }
  let absentStudents = [];
  const absentStudent = students.map((std) => {
    studentName.map((names) => {
      if (std.id === names.studentId) {
        let data = {
          ...names,
          count: Math.floor(days) - names.count,
        };
        absentStudents.push(data);
      }
    });
  });
  console.log(absentStudents, "Absent");
  return (
    <Card style={{ textAlign: "center" }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {props.classRoom === "All"
            ? "Most Absent in University"
            : "Most Absent in ClassRoom"}
        </Typography>
        {studentName.length > 0 && (
          <Doughnut
            data={{
              labels: absentStudents.map(
                (data) => data.studenName || data.name
              ),
              datasets: [
                {
                  data: absentStudents.map((data) => data.count),
                  backgroundColor: [
                    "#FF8C00",
                    "green",
                    "red",
                    "#BDB76B",
                    "#2E8B57",
                    "#4682B4",
                    "#00008B",
                    "#DEB887",
                  ],
                  hoverBackgroundColor: [
                    "#FFA500",
                    "lightgreen",
                    "#FF7F7F",
                    "#F0E68C",
                    "#3CB371",
                    "#B0C4DE",
                    "#0000CD",
                    "#F5DEB3",
                  ],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export const PresentToday = (props) => {
  const { students, attendence } = useSelector((state) => {
    return {
      students: state.students,
      attendence: state.attendence,
    };
  });
  let Students = [];
  console.log("attendence count", attendence);
  students.filter((data) => {
    attendence.map((att) => {
      let attDate = new Date(att.timeDate.split("T")[0]);
      let check = props.isSameDayfunc(attDate, new Date());
      if (check === true) {
        if (props.classRoom === "All") {
          if (data.id === att.studentId) {
            Students.push(att);
          }
        } else if (
          props.classRoom === data.classRoom &&
          data.id === att.studentId
        ) {
          Students.push(att);
        }
      }
    });
  });
  console.log(Students, "filter most Present");
  return (
    <>
      <Card style={{ textAlign: "center" }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            {props.classRoom === "All"
              ? "Students Present Today in University"
              : "Students Present Today in ClassRoom"}
          </Typography>
          {Students.map((data, i) => (
            <ListItem button>
              <ListItemText
                primary={`${i + 1} ${data.studentName}`}
                key={data.studentId}
              />
            </ListItem>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export const AbsentToday = (props) => {
  const { students, attendence } = useSelector((state) => {
    return {
      students: state.students,
      attendence: state.attendence,
    };
  });
  let Students = [];
  let newStudents = [];
  console.log("attendence count", attendence);
  students.filter((data) => {
    if (attendence.length > 0) {
      attendence.map((att) => {
        let attDate = new Date(att.timeDate.split("T")[0]);
        let check = props.isSameDayfunc(attDate, new Date());
        if (check === true) {
          if (att.studentId !== data.id) {
            console.log(data);
            newStudents.push(data);
          }
        }
      });
    } else {
      newStudents.push(data);
    }
  });
  console.log(newStudents, "filter abcent today");
  return (
    <>
      <Card style={{ textAlign: "center" }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            {props.classRoom === "All"
              ? "Students Abcent Today in University"
              : "Students Present Today in ClassRoom"}
          </Typography>
          {students.length !== newStudents.length &&
            newStudents.map((data, i) => (
              <ListItem button>
                <ListItemText
                  primary={`${i + 1} ${data.studentName}`}
                  key={data.id}
                />
              </ListItem>
            ))}
        </CardContent>
      </Card>
    </>
  );
};
