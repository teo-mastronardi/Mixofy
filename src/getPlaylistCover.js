export async function getPlaylistCover(spotifyApi,playlistID){
    let url = "wooho"
    try {
        await spotifyApi.getPlaylistCoverImage(playlistID)
        .then((response) => {
            url = response[1].url;
        })
    }
    catch(err){
        console.log(err);
    }
    return url;
}
