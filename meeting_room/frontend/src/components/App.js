import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import RoomJoinPage from "./RoomJoinPage";
import Room from "./Room";
import Chat from "./Chat"

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code,
        });
      });
  }

  clearRoomCode() {
    this.setState({
      roomCode: null,
    });
  }

  render() {
    return (
      <div className="center">
        <Router>
        <Switch>
        <Route
            exact
            path="/"
            render={(props) => {
              return this.state.roomCode ? (
                <Redirect to={`/room/${this.state.roomCode}`} />
              ) : (
                <HomePage {...props}/>
              );
            }}
          />
          <Route path="/join" component={RoomJoinPage} />
          <Route path='/homePage' component={HomePage} />
          <Route
            path="/room/:roomCode"
            render={(props) => {
              return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
            }}
          />
          <Route path="/chat" component={Chat}
          />
        </Switch>
      </Router>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
