import React, { Component, useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import {createPlaylist} from './createPlaylist.js';
import {getRecommendations} from './getRecommendations.js';

const spotifyApi = new SpotifyWebApi();

function App(props){

  const getHashParams = () => {
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

  const params = getHashParams();
  const token = params.access_token;
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  // Change this to something persistent 

  const [seeds, setSeeds] = useState({
    seed_genres:"edm,electronic",
    seed_artists:"",
    seed_tracks:"",
    limit:10,
    min_tempo:140,
    max_temp: 300,
    min_popularity:50,
    max_popularity:100,
    min_acoustiness:0.0,
    max_acoustiness:1.0,
    min_danceability: 0.0,
    max_danceanility:1.0,
    min_energy:0.0,
    max_energy:1.0,
    min_instrumentalness:0.0,
    max_instrumentalness:1.0
   })
   
   const loggedIn = token ? true : false;
   const [playlistName, setPlaylistName] = useState('')
   const [startYear, setStartYear] = useState(1900)
   const [endYear, setEndYear] = useState(1900)

   
   useEffect(() => {
     console.log(playlistName)
     console.log(seeds.limit)
    //\\setPlaylistName(name)

    // setValues({
    //   …form,
    //   first: ‘Jamie’,
    //   subscribe: true
    //  })
   })

   async function startApp() {
    // Create the playlist
    console.log("testest")
    var response = await createPlaylist(spotifyApi,playlistName);
    var playlistId = response.id;
    
    // Get the songs based on the seeds
    var uris = await getRecommendations(spotifyApi,seeds);
    console.log(uris);

    // Add to playlists
    spotifyApi.addTracksToPlaylist(playlistId,uris)
  }

  return (
    <div className="App">
      {!loggedIn && 
      <a href='http://localhost:8888' > Login to Spotify </a>
      }
      { loggedIn && // Start building the app
        <div>
          <p>Welcome to the app</p>
          <form onSubmit={() => startApp()}>
            <label>
              Playlist Name:
              <input type="text" value={playlistName} 
                     onChange={e => setPlaylistName(e.target.value)}  />
            </label>
            <label>
              Number of songs:
              <input type="number" value={seeds.limit} 
                     onChange={e => setSeeds({limit:e.target.value})} />
            </label>
            <input type="submit" value="Submit" />
          </form>

        </div>
      }
    </div>
  );
  
}


export default App;