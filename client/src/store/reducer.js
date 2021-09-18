const reducer = (state, action) => {
  switch (action.type) {
    case "SIGNIN":
      console.log("reducer", action.payload);
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.asscessToken,
      };
    case "SIGNOUT":
      return {
        ...state,
        user: action.payload,
        accessToken: action.payload,
      };
    case "ADDCLASSROOM":
      return {
        ...state,
        classRoom: [...state.classRoom, action.payload.data],
      };
    case "GETCLASSROOM":
      console.log(action.payload);
      return {
        ...state,
        classRoom: action.payload.data,
      };
    case "ADDSTUDENT":
      return {
        ...state,
        students: [...state.students, action.payload.data],
      };
    case "GETSTUDENT":
      return {
        ...state,
        students: action.payload.data,
      };
    case "DELETEDATA":
      return {
        ...state,
        students: state.students.filter(
          (data) => data.id !== action.payload && data
        ),
      };
    case "GETATTENDENCE":
      return {
        ...state,
        attendence: action.payload.data,
      };
    case "GETALLLOGS":
      return {
        ...state,
        studentsLogs: action.payload.data,
      };
    default:
      return state;
  }
};

export default reducer;
