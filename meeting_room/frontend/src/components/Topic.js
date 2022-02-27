import React, { Component } from "react";
import { Grid, Button, Typography, ButtonGroup } from "@material-ui/core";
import CreateTopic from "./CreateTopic";

export default class Topic extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.handleDeleteButtonPressed = this.handleDeleteButtonPressed.bind(this);
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
    fetch("/api/delete-topic" + "?id=" + this.props.id, { method: 'DELETE' })
        .then(() => {this.props.updateCallback()});
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
            update={true}
            title = {this.state.title}
            time_last = {this.state.time_last}
            description = {this.state.description}
            id = {this.props.id}
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
      <Grid item xs={12} align="center">
        <ButtonGroup disableElevation variant="contained" color="primary">
        <Button color="primary" onClick={() => this.updateShowSettings(true)}>
          Edit
        </Button>
        <Button color="secondary"  onClick={this.handleDeleteButtonPressed}>
          Delete
        </Button>
      </ButtonGroup>
    </Grid>
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