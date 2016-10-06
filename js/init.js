//API keys, made global
var key = '6482c833c701e11ea0e0ad3af29e89a1';
var secret = '965ff338e1397345cb1eb0290fe3aa56';
// var spotifyClientID = '7e45ff3bfe924046ace9fecf82b5b9e2';
// var spotifyClientSecret = '9d723e0777284964ba863aa3f67c6219';

function getArtistInfo(artist) {
  //using variable name instead of key makes for cleaner more readable code, also less room for errors when copying
  $.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artist + '&api_key=' + key + '&format=json', function(data) {
    //get rid of stupid last.fm advertisement in the band bio
    var bandBio = data.artist.bio.summary.replace(/<a(\s[^>]*)?>.*?<\/a>/ig, '');
    //sets variable of list of similar artists from the band object
    var similarArtists = data.artist.similar.artist;
    //sets the html element to the name of the current artist
    $('#band-name span').text(data.artist.name);
    //changes the background image to the current bands image (also found in object)
    $('#band-name').css({
      backgroundImage: 'url(' + data.artist.image[3]['#text'] + ')'
    });
    $('#sideBarImg').css({
      backgroundImage: 'url(' + data.artist.image[3]['#text'] + ')'
    });
    //sets the band bio to the element with the matching ID tag
    $('#band-bio').html(bandBio);
    //this HOF appends a link tag to the band name - link is selected next artist from list
    $('#related-bands ul').html('');
    similarArtists.forEach(function(artist, index) {
      var listItem = $('<li class="related-bands-lis">' + '<a href="#">' + artist.name + '</a></li>')
      listItem.hide().appendTo('#related-bands ul').fadeIn(1000 + (index * 1500));
    }, [1]);
    if (similarArtists.length === 0) {
      $('#related-bands ul').append('<li class="related-bands-lis">Sorry, your search did not <br> return any similar artists</li>');
    }
  })
};
////try to get song
function getTopTrack(artist) {
  //using variable name instead of key makes for cleaner more readable code, also less room for errors when copying
  $.get('http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=' + artist + '&api_key=' + key + '&format=json', function(data) {
    var topTrackName = data.toptracks.track[1].name;
    var topTrackUrl = data.toptracks.track[1].url;

  })
};
//spotify get artist ID
function getSpotifyID(artist) {
  //using variable name instead of key makes for cleaner more readable code, also less room for errors when copying
  $.get("https://api.spotify.com/v1/search?q=" + artist + "&type=artist", function(data) {
    var spotifyID = data.artists.items[0].id;
    getSpotifyTracks(spotifyID)
  })
};
///

///
//spotify get artist toptracks
function getSpotifyTracks(artistID) {
  //using variable name instead of key makes for cleaner more readable code, also less room for errors when copying
  $.get("https://api.spotify.com/v1/artists/" + artistID + "/top-tracks?country=US", function(data) {
    var songUrl = data.tracks[0].preview_url;
    var audioTag = new Audio(songUrl);
    $('#audioDiv').html(audioTag);
    audioTag.play();
  })
};
// end artist toptracks

function search(searchTerm) {
  //(JQ method) ajax request to pull artist object from last.fm
  $.get('http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + searchTerm + '&api_key=' + key + '&format=json', function(data) {
    //stores artist object
    var artist = data.results.artistmatches.artist[0];

    getArtistInfo(artist.name);
    getTopTrack(artist.name);
    getSpotifyID(artist.name);
    //clear search bar on submit
    $('#search').val('');
  });
}

(function($) { //IIFE
  $(function() {
    // Initialize collapse button (found on mat. site)
    $(".button-collapse").sideNav({
      menuWidth: 240, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    //$('.collapsible').collapsible();
    $('#search-form').on('submit', function(event) {
      //prevents page from reloading when the submit button is clicked
      event.preventDefault();
      //sets the entered text in the search bar to a variable
      var searchTerm = $('#search').val();
      $('#slide-out').append('<li class="related-bands-lis">' + '<a href="#">' + searchTerm + '</li>');
      search(searchTerm)
    });
    $('#related-bands ul').on('click', 'li a', function(event) {
      event.preventDefault();
      var artist = $(this).text();
      getArtistInfo(artist);
      var appendedSideBarArtists = $('<li class="related-bands-lis">' + '<a href="#">' + artist + '</a></li > ');
      $('#slide-out').append(appendedSideBarArtists);
      search(artist);
      ///
      appendedSideBarArtists.on('click', function(event) {
        event.preventDefault();
        //fetch id from li
        getArtistInfo(appendedSideBarArtists[0].innerText.replace(/\W/, ''));
        getTopTrack(appendedSideBarArtists[0].innerText.replace(/\W/, ''));
        getSpotifyID(appendedSideBarArtists[0].innerText.replace(/\W/, ''));
        getSpotifyTracks(appendedSideBarArtists[0].innerText.replace(/\W/, ''));
        search(appendedSideBarArtists[0].innerText.replace(/\W/, ''));
        $('.button-collapse').sideNav({
          menuWidth: 240, // Default is 240
          edge: 'left', // Choose the horizontal origin
          closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        });
      });
    });
  });
})(jQuery); // end of jQuery name space
