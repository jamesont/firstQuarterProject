var getTopTrack = function(artist) {
  //using variable name instead of key makes for cleaner more readable code, also less room for errors when copying
  $.get("https://api.spotify.com/v1/search?q=tania%20bowra&type=artist", function(data) {
    var topTrackName = data.toptracks.track[1].name;
    var topTrackUrl = data.toptracks.track[1].url;
  })
};
