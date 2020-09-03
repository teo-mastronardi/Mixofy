import React, { Component } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import {createPlaylist} from './createPlaylist.js';
import {getRecommendations} from './getRecommendations.js';

const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    // Change this to something persistent 
    this.state = {
      loggedIn: token ? true : false,
      playlistName: '',
      seeds: {
        seed_genres:"edm,electronic",
        limit:10,
        min_tempo:140,
        min_popularity:50
      }
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({playlistName: event.target.value});
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }
  render() {
    return (
      <div className="App">
        {!this.state.loggedIn && 
        <a href='http://localhost:8888' > Login to Spotify </a>
        }
        { this.state.loggedIn && // Start building the app
          <div>
            <p>Welcome to the app</p>
            <form onSubmit={() => this.startApp()}>
              <label>
                Playlist Name:
                <input type="text" value={this.state.playlistName} onChange={this.handleChange}  />
              </label>
              <input type="submit" value="Submit" />
            </form>

          </div>
        }
      </div>
    );
  }
  async startApp(){
    // Create the playlist
    var response = await createPlaylist(spotifyApi,this.state.playlistName);
    var playlistId = response.id;
    
    // Get the songs based on the seeds
    var uris = await getRecommendations(spotifyApi,this.state.seeds);
    console.log(uris);

    // Add to playlists
    spotifyApi.addTracksToPlaylist(playlistId,uris)
  }
}


export default App;