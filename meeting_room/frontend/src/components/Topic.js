import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";

export default class Topic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      isHost: this.props.isHost,
      title: "",
      time_last: "",
      description: "",
      showSettings: false,
    };
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettingsButton = this.renderSettingsButton.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.getTopicDetails = this.getTopicDetails.bind(this);
    this.handleDeleteButtonPressed = this.handleDeleteButtonPressed(this);
    this.getTopicDetails();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.id !== prevProps.id) {
      this.getTopicDetails();
    }
  }

  getTopicDetails() {
      if (this.props.id != null) { 
    return fetch("/api/get-topic" + "?id=" + this.props.id)
    .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({
          title: data.title,
          time_last: data.time_last,
          description: data.description,
        });
      });
    }
  }

  handleDeleteButtonPressed() {

      
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
          <CreateTopic //??
            update={true}
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getTopicDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.updateShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderSettingsButton() {
    return (
        <ButtonGroup disableElevation variant="contained" color="primary">
        <Button color="primary"  onClick={this.handleDeleteButtonPressed}>
          Delete
        </Button>
        <Button color="secondary" onClick={() => this.updateShowSettings(true)}>
          Edit
        </Button>
      </ButtonGroup>
    
    );
  }

  render() {
    if (this.state.showSettings) {
      return this.renderSettings();
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Title: {this.state.title}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Time last: {this.state.time_last}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Description: {this.state.description}
          </Typography>
        </Grid>
        {this.state.isHost ? this.renderSettingsButton() : null}
      </Grid>
    );
  }
}