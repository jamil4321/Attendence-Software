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

const AddClassRoom = () => {
  const dispatch = useDispatch();
  const { classRoom, accessToken } = useSelector((state) => {
    return {
      classRoom: state.classRoom,
      accessToken: state.accessToken,
    };
  });
  const [open, setOpen] = React.useState(false);
  const handldialog = () => {
    setOpen(false);
  };
  const classes = useStyles();
  // React.useEffect(() => {
  //   const func = async () => {
  //     await getClassRooms();
  //   };
  //   func();
  // }, []);

  // const getClassRooms = async () => {
  //   let data = await fetch("http://localhost:2000/api/getAllClassRoom", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + accessToken,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => data)
  //     .catch((err) => console.log(err));
  //   console.log(data);
  //   dispatch({ type: "GETCLASSROOM", payload: data });
  // };
  console.log(classRoom);
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
      <DialogFrom variant="classRoom" open={open} close={handldialog} />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>Class Name</TableCell>
              <TableCell align="right">Action Button</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* <TableRow>
                <TableCell>1</TableCell>
                <TableCell component="th" scope="row">
                  1 A
                </TableCell>
                <TableCell align="right">
                  <Button>View</Button>
                </TableCell>
              </TableRow> */}
            {classRoom.length > 0
              ? classRoom.map((data, i) => (
                  <TableRow key={data.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell component="th" scope="row">
                      {data.classRoomName}
                    </TableCell>
                    <TableCell align="right">
                      <Button onClick={() => {}}>View</Button>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AddClassRoom;
