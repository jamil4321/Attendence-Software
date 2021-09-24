import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import DialogFrom from "../dialog/DialogForm";
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
    minWidth: 650,
  },
}));

const AddStudent = () => {
  const dispatch = useDispatch();
  const { accessToken, students } = useSelector((state) => {
    return {
      accessToken: state.accessToken,
      students: state.students,
    };
  });
  React.useEffect(() => {
    const func = async () => {
      await getAllStudent();
    };
    func();
  }, []);

  const getAllStudent = async () => {
    let data = await fetch("http://localhost:2000/api/getAllStudents", {
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
    dispatch({ type: "GETSTUDENT", payload: data });
  };
  console.log(students);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handldialog = () => {
    setOpen(false);
  };
  const deleteStudent = async (id) => {
    let data = await fetch("http://localhost:2000/api/deleteStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => data)
      .catch((err) => console.log(err));
    console.log(data);
    if (data.message !== "Student Deleted") {
      alert(data.message);
    }
    dispatch({ type: "DELETEDATA", payload: id });
  };
  return (
    <div
      className={classes.root}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignContent: "flex-end",
        height: "80vh",
      }}
    >
      <div>
        <Fab color="primary" aria-label="add" onClick={() => setOpen(true)}>
          <AddIcon />
        </Fab>
      </div>
      <DialogFrom variant="students" open={open} close={handldialog} />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Departname</TableCell>
              <TableCell align="right">Action Button</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0
              ? students.map((data, i) => {
                  return (
                    <TableRow key={data.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell component="th" scope="row">
                        {data.studentName}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {data.departmentName}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => deleteStudent(data.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AddStudent;
