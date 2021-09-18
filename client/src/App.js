import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import SignIn from "./Components/auth/signin";
import SignUp from "./Components/auth/signup";
import Home from "./Components/home";
import socketCon from "./socket/socket";

function App() {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => {
    return {
      user: state.user,
      accessToken: state.accessToken,
    };
  });
  React.useEffect(() => {
    socketCon.emit("hello World");
    socketCon.on("hello", () => {
      console.log("hi!");
    });
  });
  React.useEffect(() => {
    const getUSERJSON = localStorage.getItem("user") || {};
    const getAccessToken = localStorage.getItem("auth");
    console.log(getAccessToken);
    let userObject = [];
    try {
      userObject = JSON.parse(getUSERJSON);
    } catch (e) {
      console.log(e);
    }
    dispatch({
      type: "SIGNIN",
      payload: { user: userObject, asscessToken: getAccessToken },
    });
  }, []);
  return (
    <Router>
      <Switch>
        {/* <Route path="/signin" component={SignIn} /> */}
        <Route path="/signup" component={SignUp} />
        <Route exact path="/" component={!user || !user.name ? SignIn : Home} />
      </Switch>
    </Router>
  );
}

export default App;
