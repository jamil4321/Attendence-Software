import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
const DialogForm = (props) => {
  const classes = useStyles();
  const [classRoomName, setClassRoomName] = React.useState("");
  const [studentName, setStudentName] = React.useState("");
  const [selectClassRoom, setSelectClassRoom] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    props.close();
    setOpen(false);
  };
  const dispatch = useDispatch();
  const { accessToken, classRoom } = useSelector((state) => {
    return {
      accessToken: state.accessToken,
      classRoom: state.classRoom,
    };
  });
  React.useEffect(() => {
    props.open ? setOpen(true) : setOpen(false);
  });
  React.useEffect(() => {
    const func = async () => {
      await getClassRooms();
    };
    func();
  }, []);
  console.log(classRoom);

  const getClassRooms = async () => {
    let data = await fetch("http://localhost:2000/api/getAllClassRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err));
    console.log(data);
    dispatch({ type: "GETCLASSROOM", payload: data });
  };
  const addClassRoom = async (e) => {
    console.log("Clicked");
    e.preventDefault();
    if (classRoomName !== "") {
      let data = await fetch("http://localhost:2000/api/newClassRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({ classRoomName }),
      })
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      if (data && data.message === "Class Room Added SuccessFully") {
        dispatch({ type: "ADDCLASSROOM", payload: data });
        handleClose();
      } else {
        handleClose();
        alert(data.message);
      }
    }
  };
  const addStudent = async (e) => {
    console.log("Clicked");
    e.preventDefault();
    if (studentName !== "") {
      let data = await fetch("http://localhost:2000/api/newStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({ name: studentName, classRoom: selectClassRoom }),
      })
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));
      if (data && data.message === "Student Added") {
        dispatch({ type: "ADDSTUDENT", payload: data });
        handleClose();
        setClassRoomName("");
        setStudentName("");
      } else {
        handleClose();
        alert(data.message);
      }
    }
  };
  return (
    <>
      {(props.variant === "classRoom" && (
        <form>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            fullWidth
          >
            <DialogTitle id="form-dialog-title">Add ClassRoom</DialogTitle>
            <DialogContent>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="Department"
                label="Add Department"
                name="Add Department"
                value={classRoomName}
                onChange={(e) => setClassRoomName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={(e) => addClassRoom(e)}
              >
                Add Department
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      )) ||
        (props.variant === "students" && (
          <form>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Add Student</DialogTitle>
              <DialogContent>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="Add Student"
                  label="Add Student"
                  name="Add Student"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="demo-simple-select-outlined-label">
                    Select Department
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={selectClassRoom}
                    onChange={(e) => setSelectClassRoom(e.target.value)}
                    label="Select Department"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {classRoom.length > 0
                      ? classRoom.map((data) => (
                          <MenuItem key={data.id} value={data.department}>
                            {data.department}
                          </MenuItem>
                        ))
                      : null}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={(e) => addStudent(e)}
                >
                  Add Students
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        ))}
    </>
  );
};

export default DialogForm;
