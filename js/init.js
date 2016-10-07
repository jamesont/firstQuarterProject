var key = '6482c833c701e11ea0e0ad3af29e89a1';
var secret = '965ff338e1397345cb1eb0290fe3aa56';

function getArtistInfo(artist) {

  $.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artist + '&api_key=' + key + '&format=json', function(data) {
    var bandBio = data.artist.bio.summary.replace(/<a(\s[^>]*)?>.*?<\/a>/ig, '');
    var similarArtists = data.artist.similar.artist;
    $('#band-name span').text(data.artist.name);
    $('#band-name').css({
      backgroundImage: 'url(' + data.artist.image[3]['#text'] + ')'
    });
    $('#sideBarImg').css({
      backgroundImage: 'url(' + data.artist.image[3]['#text'] + ')'
    });
    $('#band-bio').html(bandBio);
    $('#related-bands ul').html('');
    similarArtists.forEach(function(artist, index) {
      var listItem = $('<li class="related-bands-lis">' + '<a href="#">' + artist.name + '</a></li>');
      listItem.hide().appendTo('#related-bands ul').fadeIn(1000 + (index * 1500));
    }, [1]);
    if (similarArtists.length === 0) {
      $('#related-bands ul').append('<li class="related-bands-lis">Sorry, your search did not <br> return any similar artists</li>');
    };
  });
};

function getTopTrack(artist) {
  $.get('http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=' + artist + '&api_key=' + key + '&format=json', function(data) {
    var topTrackName = data.toptracks.track[1].name;
    var topTrackUrl = data.toptracks.track[1].url;
  });
};

function getSpotifyID(artist) {
  $.get("https://api.spotify.com/v1/search?q=" + artist + "&type=artist", function(data) {
    var spotifyID = data.artists.items[0].id;
    getSpotifyTracks(spotifyID);
  });
};

function getSpotifyTracks(artistID) {
  $.get("https://api.spotify.com/v1/artists/" + artistID + "/top-tracks?country=US", function(data) {
    var songUrl = data.tracks[0].preview_url;
    var songName = data.tracks[0].name;
    var artist = data.tracks[0].artists[0].name;
    var audioTag = new Audio(songUrl);
    $('#current-songTrack').html(songName).hide().fadeIn(10000);;
    $('#audioDiv').html(audioTag);
    audioTag.play();
  });
};

function search(searchTerm) {
  $.get('http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + searchTerm + '&api_key=' + key + '&format=json', function(data) {
    var artist = data.results.artistmatches.artist[0];
    if (artist == undefined) {
      $('#band-name').css({
        backgroundImage: 'url(' + './js/couldntFind.jpeg' + ')'
      });
    };
    getArtistInfo(artist.name);
    getTopTrack(artist.name);
    getSpotifyID(artist.name);
    $('#search').val('');
  });
};

(function($) {
  $(function() {
    $(".button-collapse").sideNav({
      menuWidth: 240,
      edge: 'left',
      closeOnClick: true
    });

    $('#search-form').on('submit', function(event) {
      event.preventDefault();
      var searchTerm = $('#search').val();
      var clickedBandLi = $('<li class="related-bands-lis" id="clicked-Band">' + '<a href="#" style="color: red">' + searchTerm + '</li>');
      $('#slide-out').append(clickedBandLi);
      search(searchTerm);
      clickedBandLi.on('click', function(event) {
        event.preventDefault();
        search(searchTerm);
      });
    });

    $('#related-bands ul').on('click', 'li a', function(event) {
      event.preventDefault();
      var artist = $(this).text();
      getArtistInfo(artist);
      var appendedSideBarArtists = $('<li class="related-bands-lis">' + '<a href="#">' + artist + '</a></li > ');
      $('#slide-out').append(appendedSideBarArtists);
      search(artist);
      appendedSideBarArtists.on('click', bandLinks(event, appendedSideBarArtists));
    });
  });
})(jQuery);
(jQuery);

function bandLinks(event, appendedSideBarArtists) {
  appendedSideBarArtists.on('click', function(event) {
    event.preventDefault();
    var appended = appendedSideBarArtists[0].innerText.replace(/\W/, '');
    getArtistInfo(appended);
    getTopTrack(appended);
    getSpotifyID(appended);
    getSpotifyTracks(appended);
    search(appended);
    $('.button-collapse').sideNav({
      menuWidth: 240,
      edge: 'left',
      closeOnClick: true
    });
  });
};
