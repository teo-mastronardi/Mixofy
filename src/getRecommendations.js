export async function getRecommendations(spotifyApi,seededInfo){
    var uris= [];

    try {
        await spotifyApi.getRecommendations(seededInfo)
        .then((response) => {
          for(var i=0; i<response.tracks.length; i++){
            uris.push(response.tracks[i].uri);
          }
          //console.log(uris)
        })
        return uris;
    }
    catch(err){
        console.log(err);
    }

}
