//API keys, made global
var key = '6482c833c701e11ea0e0ad3af29e89a1';
var secret = '965ff338e1397345cb1eb0290fe3aa56';

var getArtistInfo = function(artist) {
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
    //sets the band bio to the element with the matching ID tag
    $('#band-bio').html(bandBio);
    //this HOF appends a link tag to the band name - link is selected next artist from list
    $('#related-bands ul').html('');
    similarArtists.forEach(function(artist) {
      $('#related-bands ul').append('<li><a href="#">' + artist.name + '</a></li > ');
    }, [1]);
  })
};
////try to get song
var getTopTrack = function(artist) {
  //using variable name instead of key makes for cleaner more readable code, also less room for errors when copying
  $.get('http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=' + artist + '&api_key=' + key + '&format=json', function(data) {
    var topTrackName = data.toptracks.track[1].name;
    var topTrackUrl = data.toptracks.track[1].url;
    console.log('track name ', topTrackName);
    console.log('track link', topTrackUrl);
    console.log('top tracks', data);
  })
};
///end get song info


(function($) { //IIF
  $(function() {

    // Initialize collapse button (found on mat. site)
    $(".button-collapse").sideNav();
    // Initialize collapsible (uncomment the line below if you use the dropdown variation)
    //$('.collapsible').collapsible();

    $('#search-form').on('submit', function(event) {
      //prevents page from reloading when the submit button is clicked
      event.preventDefault();
      //sets the entered text in the search bar to a variable
      var searchTerm = $('#search').val();
      //(JQ method) ajax request to pull artist object from last.fm
      $.get('http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=' + searchTerm + '&api_key=' + key + '&format=json', function(data) {
        //stores
        var artist = data.results.artistmatches.artist[0];
        console.log(artist);
        var artistID = artist.mbid;

        getArtistInfo(artist.name);
        getTopTrack(artist.name);
      });
    });

    $('#related-bands ul').on('click', 'li a', function(event) {
      event.preventDefault();
      var artist = $(this).text();
      console.log(artist);
      getArtistInfo(artist);

      $('#slide-out').append('<li>' + '      ' + artist + '</li>');
      // console.log('this', artist);
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space
