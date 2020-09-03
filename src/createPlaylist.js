export async function createPlaylist(spotifyApi,playlistName) {
    var playlistInfo = {
        name:playlistName,
        public:false, 
        description:"Playlist Generated automatically based on your feedback by Mixofy."
      }
      // Create playlist
    try{
        const response = await spotifyApi.createPlaylist("elfred7",playlistInfo);
        return response;
    }
    catch(err){
        console.log(err)
    }
}
