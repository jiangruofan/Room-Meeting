import React, { Component } from "react";
import { Grid, Button, Typography, TextField, Collapse} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export default class CreateTopic extends Component {
  static defaultProps = {
    title: "",
    time_last: "",
    description: "",
    updateCallback: () => {},
    code: null,
    id: null,
    update: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      time_last: this.props.time_last,
      description: this.props.description,
      errorMsg: "",
      successMsg: "",
    };
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTopicButtonPressed = this.handleTopicButtonPressed.bind(this);
    this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);

  }

  handleTopicButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: this.state.title,
        time_last: this.state.time_last,
        description: this.state.description,
      }),
    };
    fetch("/api/add-topic" + "?code=" + this.props.code, requestOptions)
      .then((response) => {
        this.props.updateCallback();
      })
  }

  handleUpdateButtonPressed() {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: this.state.title,
        time_last: this.state.time_last,
        description: this.state.description,
      }),
    };
    fetch("/api/edit-topic" + "?id=" + this.props.id, requestOptions).then(
      (response) => {
        if (response.ok) {
            this.setState({
              successMsg: "Topic updated successfully!",
            });
          } else {
            this.setState({
              errorMsg: "Error updating topic...",
            });
          }
        this.props.updateCallback();
      }
    );
  }

  renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleTopicButtonPressed}
          >
            Create A Topic
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" onClick={() => this.props.updateCallback()}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderUpdateButtons() {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleUpdateButtonPressed}
        >
          Update Topic
        </Button>
      </Grid>
    );
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value,
    });
  }

  handleTimeChange(e) {
    this.setState({
      time_last: e.target.value,
    });
  }

  handleDescriptionChange(e) {
    this.setState({
      description: e.target.value,
    });
  }

  render() {
    const title = this.props.update ? "Update Room" : "Create a Room";
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Collapse
            in={this.state.errorMsg != "" || this.state.successMsg != ""}
          >
            {this.state.successMsg != "" ? (
              <Alert
                severity="success"
                onClose={() => {
                  this.setState({ successMsg: "" });
                }}
              >
                {this.state.successMsg}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  this.setState({ errorMsg: "" });
                }}
              >
                {this.state.errorMsg}
              </Alert>
            )}
          </Collapse>
        </Grid>

        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <TextField
            value={this.state.title}
            label="Enter title"
            onChange={this.handleTitleChange}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <TextField
            value={this.state.time_last}
            label="Enter time lasting"
            onChange={this.handleTimeChange}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <TextField
            value={this.state.description}
            label="Enter description"
            onChange={this.handleDescriptionChange}
            multiline
          />
        </Grid>
        {this.props.update
          ? this.renderUpdateButtons()
          : this.renderCreateButtons()}
      </Grid>
    );
  }
}
