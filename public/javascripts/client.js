$(function($) {

  // needed for socket.io functionality
  var socket = io.connect();


  // assign dom elements to variables hopefully DRY things up
  var $commentBox = $('#comment-box');
  var $commentList = $('#comment-list');
  var $weatherButton = $('#get-weather');

//=======================================================================//
//                Click event for Get Weather button                     //
//=======================================================================//

  $weatherButton.on('click', function(e) {
    e.preventDefault;
    console.log('Fetching weather...');

    // Initialize skycons
    var skycons = new Skycons({"color": "black"});

    // clear comments so they can be re populated with
    // comments for a specific city
    $('.comment').remove();

    // Grab city name string from input field and
    // store it as lower case to prevent duplicate
    // entries i.e. Austin and austin or AUSTIN
    $cityName = $('#cityName').val().toLowerCase();

    // clear error messages if any
    $('#error').hide();

    // Fade out main display so it can fade back in
    $('.container.main').fadeOut(200);

//=======================================================================//
//                Ajax call for Weather Info                             //
//=======================================================================//

    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + $cityName + "&mode=json&units=imperial",
      type: "get",
      dataType: "json",
      success: function (data) {
//=======================================================================//
//          Only show results if city name                               //
//           input is valid                                              //
//=======================================================================//

        if (data.cod === 200) {
          console.log(data.cod);

          // fade out welcome pane
          $('.welcome').fadeOut(100);

          // store city name in array
          socket.emit('send city name', $cityName, function(data) {
          });

          // little trick I found to capitalize lower case city name variable
          // to make display nicer :)
          $('#cityNameBanner').text($cityName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                return letter.toUpperCase();
            }) + " Weather");

          // fade in main container with weather data
          $('.container.main').fadeIn(200);

          // Update named fields with API weather data for specific city
          $('#humidity').text(data.main.humidity + " %");
          $('#pressure').text(data.main.pressure + " hPa");
          $('#wind-speed').text(data.wind.speed + " mph");
          $('#temperature').text(data.main.temp + " °F");
          $('#high').text(data.main.temp_max + " °F");
          $('#low').text(data.main.temp_min + " °F");

          // Clear city weather input value
          $('#cityName').val('');

          // Obtain weather status from API Json.
          // e.g. "Rain", "Snow", etc
          var weatherCondition = data.weather[0].main
          console.log(weatherCondition);

          // Display appropriate Skycon based on current weather.
          switch(weatherCondition)
          {
            case "Clouds":
              skycons.add("icon1", Skycons.CLOUDY)
              break;
            case "Clear":
              skycons.add("icon1", Skycons.CLEAR_DAY)
              break;
            case "Rain":
              skycons.add("icon1", Skycons.RAIN)
              break;
            case "Wind":
              skycons.add("icon1", Skycons.WIND)
              break;
            case "Fog":
              skycons.add("icon1", Skycons.FOG)
              break;
            case "Snow":
              skycons.add("icon1", Skycons.SNOW)
              break;
            case "Mist"
              skycons.add("icon1", Skycons.FOG)
              break;
            default:
              "ø"
          }

          // Animate Skycons
          skycons.play();

        } else {
          // Return what was typed into city name input if gibberish
          console.log("Sorry, please enter a city");
          // display any errors in a bootstrap styled error flash
          $('#error').fadeIn(200).html("Sorry, " + $cityName + " is either not a city or is spelled incorrectly.");
          // clear city name input field
          $('#cityName').val('');
        }
      },
      error: function(xhr, status) {
        // In case there's an error on the API side
        console.log("There was an error");
        $('#error').fadeIn(200).html("There was an error, please try again later");
      }
    });
   });

//=======================================================================//
//                  Socket.io click functions for when Post              //
//                  button is clicked for submitting a new comment       //
//=======================================================================//

  $('#submit-comment').on('click', function(e) {
    e.preventDefault;
    // grab text in comment box, emit create comment event,
    socket.emit('create comment', $commentBox.val());
    // then clear for next comment
    $commentBox.val('');
  });

  socket.on('new comment', function(data) {
    $cityName = $('#city-name').val();
    $commentList.append("<li class='comment'>" + data.comment + "</li>");
  });

  socket.on('load comments for city', function(docs) {
    // iterate through docs object and append comment value to dom
    $.each(docs, function ( index, value ) {
      $commentList.append("<li class='comment'>" + value.comment + "</li>");
    });
  });
});
