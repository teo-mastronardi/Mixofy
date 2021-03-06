import React, { useState, useEffect } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import {createPlaylist} from './createPlaylist.js';
import {getRecommendations} from './getRecommendations.js';
import {getPlaylistCover} from './getPlaylistCover.js';
import {DialogGenreSelect} from './components/genreSelect.js';
import {RangeSlider} from './components/rangeSlider.js';

import { Button, 
         Container, 
         //TextField,
         Input,
        }
from '@material-ui/core';

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
    seed_genres:[],  
    seed_artists:"",
    seed_tracks:"",
    limit:10,
   })
   
   const loggedIn = token ? true : false;
   const [playlistName, setPlaylistName] = useState('')
   //const [startYear, setStartYear] = useState(1900)
   //const [endYear, setEndYear] = useState(1900)
   const [nonRange, setNonRange] =useState(["seed_genres","seed_artists","seed_tracks","limit"])

   const [loading, setLoading] = useState(false)
   const [done, setDone] = useState(false)
   const [img, setImg] = useState()

   const [linkToPlaylist, setLinkToPlaylist] = useState("")

   
   useEffect(() => {

    // setValues({
    //   …form,
    //   first: ‘Jamie’,
    //   subscribe: true
    //  })
    console.log(seeds)

   })

   async function startApp() {
    // Create the playlist
    setLoading(true)
    var response = await createPlaylist(spotifyApi,playlistName);
    var playlistId = response.id;
    
    // Get the songs based on the seeds
    //var uris = await getRecommendations(spotifyApi,seeds);
    var uris;
    await getRecommendations(spotifyApi,seeds).then((value) => {
       uris = value
       console.log(uris)
    }, (errorReason) => {
      console.log("No tracks for the musica", errorReason)
    });
    // Add to playlists
    await spotifyApi.addTracksToPlaylist(playlistId,uris)

    await getPlaylistCover(spotifyApi,playlistId).then((value) => {
        setImg(value.images[1].url)
        setLinkToPlaylist(value.external_urls.spotify)
    }, (errorReason) => {
      console.log("No image:", errorReason)
    });


    setLoading(false)
    setDone(true)
  }

  function getData(data,type){ 

    if(!nonRange.includes(type)){
      var min = "min_"+type.toLowerCase();
      var max = "max_"+type.toLowerCase();
      setSeeds({...seeds, [min]:data[0],[max]:data[1]});
    }
    else{
      setSeeds({...seeds, [type.toLowerCase()]:data}); 
    }
  }

  return (
    <div className="App">
      <Container maxWidth="md" >
      {!loggedIn && 
      <a href='http://localhost:8888' > Login to Spotify </a>
      }
      { loggedIn && 
        <div>
          <p>Welcome to the app</p>

          <Input placeholder="Playlist Name" inputProps={{ 'aria-label': 'description' }} 
              value={playlistName} onChange={e => setPlaylistName(e.target.value)} 
              //helperText="The name you want the generated playlist to be"
              />

          <Input placeholder="Number of Songs" inputProps={{ 'aria-label': 'description' }} 
              type="number" size="small" value={seeds.limit}
              onChange={e => setSeeds({...seeds,limit:e.target.value})}
              //helperText="The limit of songs you want in the playlist"
              />

          <DialogGenreSelect sendData={getData}/>

          <RangeSlider type="Tempo" min={50} max={200} start={0} end={0} step={2} sendData={getData}/>
          <RangeSlider type="Popularity" min={0} max={100} start={0} end={0} step={5} sendData={getData}/>
          {/* Advanced Section?? */}
          <RangeSlider type="Energy" min={0} max={1} start={0} end={0} step={.1} sendData={getData}/>
          <RangeSlider type="Danceability" min={0} max={1} start={0} end={0} step={.1} sendData={getData}/>
          <RangeSlider type="Acousticness" min={0} max={1} start={0} end={0} step={.1} sendData={getData}/>

          <RangeSlider type="Instrumentalness" min={0} max={1} start={0} end={0} step={.1} sendData={getData}/>

          <Button size="small" variant="contained" color="primary" onClick={() => startApp()} disabled={loading}  
          > { loading && (<i className="fa fa-refresh fa-spin"></i>)}
              {loading && <span>Generating Playlist</span>}
              {!loading && !done && <span>Submit</span>} 
              {done && <span>Done!</span>}          
          </Button>
          {/* 
            Key
            Liveness
            loudness
            mode
            speechiness
            time_signature
            valence
          */}
          <a href={linkToPlaylist}>
          <img src={img}/></a>
        </div>
      }</Container>
    </div>
  );
  
}


export default App;