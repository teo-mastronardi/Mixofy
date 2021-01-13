export async function getPlaylistCover(spotifyApi,playlistID){

    try {
        await spotifyApi.getPlaylistCoverImage(playlistID)
        .then((response) => {

            console.log("hey",response[1].url)
            return response[1].url;
        })
    }
    catch(err){
        console.log(err);
    }

}
