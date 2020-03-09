import React from 'react';
import hash from './hash';
import logo from './logo.svg';
import './App.css';
import * as $ from 'jquery';
import Player from "./Player";

export const authEndpoint = 'https://accounts.spotify.com/authorize';

const clientID = "d8bcda8188d3434eb0fa1eae35c25663";
const redirectUri = "http://localhost:3000";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state"
];

//Get has of the URL
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce((initial, item) => {
    if (item) {
      let parts = item.split("=");
      initial[parts[0]] = decodeURI(parts[1]);
    }
    return initial;
  }, {});

  window.location.hash = "";


class App extends Component {
  constructor() {
    super();
    this.state = {
        token: null,
      item: {
        album: {
          images: [{ url: ""}]
        },
        name: "",
        artists: [{ name: ""}],
        duration_ms: 0,
      },
      is_playing: "Paused",
      progress_ms: 0
    };

    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }

  getCurrentlyPlaying(token) {
    //Make a call using token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer" + token);
      },
      success: (data) => {
        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms,
        });
      }
    })
  }

  componentDidMount() {
    //Set token
    let _token = hash.access_token;
    if (_token) {
      this.setState({
        token: _token
      });
    }
  }

  render() {
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />

            {!this.state.token && (
              <a className="btn btn--loginApp-link" href={`${authEndpoint}client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>Login to local Spotify</a>
            )}

            {this.state.token && (
              //Spotify player here
            )}
          </header>
        </div>
      );
  }
}

export default App;
