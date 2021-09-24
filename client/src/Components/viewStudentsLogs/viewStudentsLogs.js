import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  TablePagination,
  Typography,
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { useDispatch, useSelector } from "react-redux";
import Socket from "../../socket/socket";
const ViewStudentsLogs = () => {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [studentName, setStudentName] = React.useState("");
  const [DateHead, setDateHead] = React.useState([]);
  const [buttonCliked, setButtonCliked] = React.useState(false);
  const [row, setRows] = React.useState([]);
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const dispatch = useDispatch();
  const [selectClassRoom, setSelectClassRoom] = React.useState("All");
  const { studentsLogs, accessToken, classRoom } = useSelector((state) => {
    return {
      classRoom: state.classRoom,
      studentsLogs: state.studentsLogs,
      accessToken: state.accessToken,
    };
  });
  useEffect(() => {
    const filterStudent = studentsLogs.filter((data) => {
      if (selectClassRoom === "All") {
        return data;
      } else if (data.departmentName === selectClassRoom) {
        return data;
      }
    });
    setRows(filterStudent);
  }, [selectClassRoom]);
  useEffect(() => {
    const func = async () => {
      await getLogs();
    };
    func();
  }, []);
  useEffect(() => {
    Socket.on("Attendence Maked", async () => {
      await getLogs();
    });
  }, []);
  const getLogs = async () => {
    if (endDate >= startDate) {
      let date1 = startDate;
      let date2 = endDate;
      let diffrentTime = date2.getTime() - date1.getTime();
      let days = diffrentTime / (1000 * 3600 * 24);
      console.log(days);
      setDateHead([]);
      for (let i = 0; i < days + 1; i++) {
        let date = new Date(
          new Date(startDate).setDate(new Date(startDate).getDate() + i)
        );
        let newDateHead = DateHead;
        await newDateHead.push(
          <TableCell align="right" key={i}>
            {date.getDate()}-{date.getMonth() + 1}-{date.getFullYear()}
          </TableCell>
        );
        await setDateHead(newDateHead);
      }
      console.log(endDate, startDate);
      let data = await fetch("http://localhost:2000/api/ViewStudentsLogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({ startDate, endDate }),
      })
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));
      console.log(data);
      if (data) {
        dispatch({ type: "GETALLLOGS", payload: data });
        setRows(data.data);
      }
      setButtonCliked(true);
    }
  };

  const filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
    console.log("value", lowercasedValue);
    if (lowercasedValue === "") setRows(studentsLogs);
    else {
      const filteredData = studentsLogs.filter((item) => {
        return Object.keys(item).some((key) =>
          studentsLogs.includes(key)
            ? false
            : item[key].toString().toLowerCase().includes(lowercasedValue)
        );
      });
      console.log(filteredData);
      setRows(filteredData);
    }
  };

  const updateRows = (value) => {
    setStudentName(value);
    filterData(value);
  };
  console.log(row, "row");
  return (
    <>
      <Paper style={{ margin: 10 }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around" alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Department Room
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={selectClassRoom}
                  onChange={(e) => setSelectClassRoom(e.target.value)}
                  label="Select Class Room"
                >
                  <MenuItem value="All">---All---</MenuItem>
                  {classRoom.length > 0
                    ? classRoom.map((data) => (
                        <MenuItem key={data.id} value={data.department}>
                          {data.department}
                        </MenuItem>
                      ))
                    : null}
                </Select>
              </FormControl>
            </Grid>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Date picker dialog"
              format="yyyy/MM/dd"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Date picker dialog"
              format="yyyy/MM/dd"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <Grid item xs={12} sm={6} md={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={getLogs}
              >
                Show Data
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {
                  exportToCSV(row, "Student Logs");
                }}
              >
                Excel Export
              </Button>
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </Paper>
      <Paper>
        <Grid container>
          <Grid item xs={12} sm={6}></Grid>
          <Grid item xs={12} sm={6}>
            <div style={{ padding: 10 }}>
              <TextField
                value={studentName}
                onChange={(e) => updateRows(e.target.value)}
                id="outlined-basic"
                label="Student Name"
                variant="outlined"
                fullWidth
              />
            </div>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>Student Id</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Camera</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row.length > 0 &&
                row
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r, i) => {
                    let date = r.timeDate.split("T")[0];
                    let time = r.timeDate.split("T")[1].split(".")[0];
                    let timeZone = `${String(Number(time.split(":")[0]) + 5)}:${
                      time.split(":")[1]
                    }`;
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={r.id}>
                        <TableCell>
                          <Typography>{i + 1}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{r.studentId}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{r.studentName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{r.departmentName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{r.camera}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{timeZone}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{date}</Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={row.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default ViewStudentsLogs;
