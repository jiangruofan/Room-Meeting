import React, { Component } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
  Link,
} from "react-router-dom";
import axios from 'axios';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.login = this.login.bind(this);
    this.login();
  }

  async login() {
    if (!localStorage.getItem('username')) {
      var axios = require('axios');
      var username = 0;

      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json",
        'PRIVATE-KEY': '668f526d-a331-410b-8660-b0aacf1419e7' },
      };
      await fetch("https://api.chatengine.io/users/", requestOptions)
      .then((response) => response.json())
      .then((data) => username = data.length);

      username = 'abcdef' + username

      var data = {
        "username": username,
        "secret": "secret-123-jBj02",
      };

      var config = {
        method: 'post',
        url: 'https://api.chatengine.io/users/',
        headers: {
          'PRIVATE-KEY': '668f526d-a331-410b-8660-b0aacf1419e7'
        },
        data : data
      };

      await axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
      localStorage.setItem('username', username);


    }
  }

  handleRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.props.history.push("/room/" + data.code);
      });
  }


  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            Meeting room
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary"  to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" onClick={this.handleRoomButtonPressed}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  }
}
