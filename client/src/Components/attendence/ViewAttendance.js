import "date-fns";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useDispatch, useSelector } from "react-redux";
import Socket from "../../socket/socket";
import {
  CountStudents,
  CountPresentStudent,
  CountAbsentStudent,
  PresentToday,
  AbsentToday,
} from "../Chart/CountStudents";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  table: {
    width: "95vw",
    height: "80vh",
    overflow: "scroll",
    minWidth: 650,
  },
}));

const ViewAttendance = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [selectClassRoom, setSelectClassRoom] = React.useState("All");
  const [DateHead, setDateHead] = React.useState([]);
  const [buttonCliked, setButtonCliked] = React.useState(false);
  const { classRoom, attendence, accessToken, students } = useSelector(
    (state) => {
      return {
        classRoom: state.classRoom,
        attendence: state.attendence,
        students: state.students,
        accessToken: state.accessToken,
      };
    }
  );

  React.useEffect(() => {
    const func = async () => {
      await getAttendence();
    };
    func();
  }, []);
  React.useEffect(() => {
    Socket.on("Attendence Maked", async () => {
      await getAttendence();
    });
  }, []);
  const getAttendence = async () => {
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
      let data = await fetch("http://localhost:2000/api/getattendence", {
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
      if (data) dispatch({ type: "GETATTENDENCE", payload: data });
      setButtonCliked(true);
    }
  };
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth()
    );
  };
  console.log(attendence, "attendence");
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around" alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="demo-simple-select-outlined-label">
                Select Class Room
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
                      <MenuItem key={data.id} value={data.classRoomName}>
                        {data.classRoomName}
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
          <Grid item xs={12} sm={6} md={3}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={getAttendence}
            >
              Show Data
            </Button>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
      <div style={{ marginTop: 30 }}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} sm={6} md={4}>
            <CountStudents classRoom={selectClassRoom} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CountPresentStudent
              classRoom={selectClassRoom}
              startDate={startDate}
              endDate={endDate}
              isSameDayfunc={isSameDay}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CountAbsentStudent
              classRoom={selectClassRoom}
              startDate={startDate}
              endDate={endDate}
              isSameDayfunc={isSameDay}
            />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={5}>
            {endDate > startDate && buttonCliked === true ? (
              <MostPresentsInUniversity
                classRoom={selectClassRoom}
                startDate={startDate}
                endDate={endDate}
                isSameDayfunc={isSameDay}
              />
            ) : null}
          </Grid> */}
          {/* <Grid item xs={12} sm={12} md={5}>
            {endDate > startDate && buttonCliked === true ? (
              <MostAbsentInUniversity
                classRoom={selectClassRoom}
                startDate={startDate}
                endDate={endDate}
                isSameDayfunc={isSameDay}
              />
            ) : null}
          </Grid> */}
          <Grid item xs={12} sm={12} md={5}>
            <PresentToday
              classRoom={selectClassRoom}
              startDate={startDate}
              endDate={endDate}
              isSameDayfunc={isSameDay}
              style={{ height: "50vh", overflow: "scroll" }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={5}>
            <AbsentToday
              classRoom={selectClassRoom}
              startDate={startDate}
              endDate={endDate}
              style={{ height: "50vh", overflow: "scroll" }}
              isSameDayfunc={isSameDay}
            />
          </Grid>
        </Grid>
        {/* <TableContainer component={Paper} className={classes.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>Student Name</TableCell>
                {DateHead.length > 0 ? DateHead.map((data) => data) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {attendence.length > 0
                ? attendence.map((data, i) => {
                    console.log(data);
                    if (selectClassRoom === "All") {
                      let att = [];
                      let date1 = startDate;
                      let date2 = endDate;
                      let diffrentTime = date2.getTime() - date1.getTime();
                      let days = diffrentTime / (1000 * 3600 * 24);
                      for (let i = 0; i < days + 1; i++) {
                        let date = new Date(
                          new Date(startDate).setDate(
                            new Date(startDate).getDate() + i
                          )
                        );
                        let check = isSameDay(new Date(data.wdate), date);
                        if (check === true) {
                          att.push(
                            <TableCell
                              style={{
                                background: "green",
                                color: "white",
                                textAlign: "center",
                              }}
                            >
                              P
                            </TableCell>
                          );
                        } else {
                          att.push(
                            <TableCell
                              style={{
                                background: "red",
                                color: "white",
                                textAlign: "center",
                              }}
                            >
                              A
                            </TableCell>
                          );
                        }
                      }
                      return (
                        <TableRow>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{data.studenName}</TableCell>
                          {att.length > 0 ? att.map((at) => at) : null}
                        </TableRow>
                      );
                    }
                  })
                : null}
            </TableBody>
          </Table>
        </TableContainer> */}
      </div>
    </div>
  );
};

export default ViewAttendance;
