import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import Topic from "./Topic";
import CreateTopic from "./CreateTopic";
import { Link } from "react-router-dom";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHost: false,
      showSettings: false,
      topics: [],
    };
    this.roomCode = this.props.match.params.roomCode;
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.getRoomDetails();
  }

  getRoomDetails() {
    return fetch("/api/get-room" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          isHost: data.host,
          topics: data.topics,
          showSettings: false,
        });
      });
      
  }

  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then(() => {
      this.props.leaveRoomCallback();
      this.props.history.push("/");
    });
  }

  updateShowSettings(value) {
    this.setState({
      showSettings: value,
    });
  }

  renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateTopic
            code={this.roomCode} history={this.props.history}
            updateCallback = {this.getRoomDetails}
          />
        </Grid>
      </Grid>
    );
  }

  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.updateShowSettings(true)}
        >
          Add Topic
        </Button>
      </Grid>
    );
  }

  render() {
    if (this.state.showSettings) {
      return this.renderSettings();
    } 

    const { topics } = this.state; 
    const inputPile = [];  //??????????????????
    for (let i = 0; i < topics.length; i+=1) {  // for????????????
      inputPile.push(  //?????????????????????????????????
        <Topic isHost={this.state.isHost} id={this.state.topics[i]} updateCallback={this.getRoomDetails}  />
      );
    }

    return (
      
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            RoomCode: {this.roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {this.state.isHost.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            to="/chat" component={Link}
          >
            Chat
          </Button>
        </Grid>


        {inputPile}
        

        {this.state.isHost ? this.renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={this.leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}
