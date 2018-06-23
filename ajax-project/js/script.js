
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', '+ cityStr;

    $greeting.text('So you want to travel to '+ address +'?');

    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location='+address+'';
    //jQuery's append method
    $body.append('<img class="bgimg" src="'+ streetViewUrl+ '">');

/////////NY AJAX request///
    var NYtimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+
        cityStr+'&sort=newest&api-key=YOUR_API_KEY'

    $.getJSON( NYtimesUrl, function( data ) {
        $nytHeaderElem.text('New York Times Articles about '+ cityStr);

        articles = data.response.docs;

        for(var i=0;i< articles.length ;i++){

            var article = articles[i];
            $nytElem.append('<li class="article">'
            +'<a href="'+article.web_url+'">'
            +article.headline.main+'</a>'
            +'<p>'+article.snippet+'</p>'+'</li>');
        };
    }).error(function() {
    $nytHeaderElem.text('New York Times Articles Could Not Be Loaded')
    //alert( "Handler for .error() called." )
  });

//////////wikipedia AJAX request////////
  var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+cityStr+'&format=json&callback=wikiCallback';
  var wikiRequestTimeout = setTimeout(function () {  // set a fail-timer for 3 seconds.
      $wikiElem.text("failed to get wikipedia resources, please try again");
  }, 3000);

  $.ajax({
    url: wikiUrl,
    dataType: 'jsonp',
    // jsonp:"callback",
    success: function(response) {
        var articleList = response[1];
        for (var i = 0; i < articleList.length; i++) {

            var articleStr = articleList[i];
            var url = 'https://en.wikipedia.org/wiki/' + articleStr;
            $wikiElem.append('<li><a href="' + url + '">'
                + articleStr + '</a></li>');
        };
        clearTimeout(wikiRequestTimeout); //if we success then we will cancel that fail timer
    }
  });
    return false;
};

$('#form-container').submit(loadData);


//7b7e4209436a4e31b78343dcbcec7a88