export async function getPlaylistCover(spotifyApi,playlistID){
    let obj = "wooho"
    try {
        await spotifyApi.getPlaylist(playlistID)
        .then((response) => {
            obj = response
        })
    }
    catch(err){
        console.log(err);
    }
    return obj;
}
