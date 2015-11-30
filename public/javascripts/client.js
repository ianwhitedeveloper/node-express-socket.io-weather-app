$(function($) {

  // needed for socket.io functionality
  var socket = io.connect();

  var API_KEY = 'fea701ddd226796bfb70b7050f7839b8';


  // assign dom elements to variables hopefully DRY things up
  var $commentBox = $('#comment-box');
  var $commentList = $('#comment-list');
  var $weatherButton = $('#get-weather');

//=======================================================================//
//                Click event for Get Weather button                     //
//=======================================================================//

  $weatherButton.on('click', function(e) {
    e.preventDefault;

    // remove lingering comment updates to prevent being rendered twice
    $('.comment-update').remove();


    // Initialize skycons
    var skycons = new Skycons({"color": "black"});

    // clear comments so they can be re populated with
    // comments for a specific city
    $('.comment').remove();

    // Grab city name string from input field and
    // store it as lower case to prevent duplicate
    // entries i.e. Austin and austin or AUSTIN
    $cityName = $('#city-name').val().toLowerCase();
    $state = $('#state').val().toLowerCase();

    // clear error messages if any
    $('#error').fadeOut(200);

    // Fade out main display so it can fade back in
    $('.container.main').fadeOut(200);

//=======================================================================//
//                Ajax call for Weather Info                             //
//=======================================================================//
    if (($cityName) && ($state)) {
    console.log('Fetching weather...');
      $.ajax({
        url: "//api.openweathermap.org/data/2.5/weather?q=" + $cityName + ", " + $state + "&mode=json&units=imperial" + "&APPID=" + API_KEY,
        type: "get",
        dataType: "jsonp",
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
            socket.emit('send city name', $cityName + ", " + $state, function(data) {
            });

            // Update banner with current city name
            $('#city-name-banner').text($cityName + ", " + $state) + " Weather";

            // fade in main container with weather data
            $('.container.main').fadeIn(200);

            // Update named fields with API weather data for specific city
            $('#humidity').text(data.main.humidity + " %");
            $('#pressure').text(data.main.pressure + " hPa");
            $('#wind-speed').text(data.wind.speed + " mph");
            $('#temperature').text(data.main.temp + " °F");
            $('#high').text(data.main.temp_max + " °F");
            $('#low').text(data.main.temp_min + " °F");

            // Clear city/state input value
            $('#city-name').val('');
            $('#state').val('');

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
              case "Mist":
              case "Haze":
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
            $('#error').fadeIn(200).text("Sorry, " + $cityName + ", " + $state + " is not valid.");
            // clear city name input field
            $('#city-name').val('');
            $('#state').val('');
          }
        },
        error: function(xhr, status) {
          // In case there's an error on the API side
          console.log("There was an error");
          $('#error').fadeIn(200).text("There was an error, please try again later");
        }
      });
    } else {
      $('#error').fadeIn(200).text("Please enter both a City Name and a State");
    }
   });

//=======================================================================//
//                  Socket.io click functions for when Post              //
//                  button is clicked for submitting a new comment       //
//=======================================================================//

  $('#submit-comment').on('click', function(e) {
    e.preventDefault;
    // remove last comment city update
    $('.comment-update').remove();

    $('#error').fadeOut(100);

    // disallow empty comments from being posted
    if ($('#comment-box').val() === "") {
      $('#error').fadeIn(200).text("Please enter a comment.");
    } else {
      // grab text in comment box, emit create comment event sent to server (app.js),
      socket.emit('create comment', $commentBox.val());
      // then clear for next comment
      $commentBox.val('');
    }
  });

  socket.on('new comment', function(data) {
    // prepend comment so it shows up at top of list. Notify which city it was
    // added to because if the app is being used concurrently, you may see
    // other comments for other cities live in your comment list, but only
    // comments for that specific city are persisted in the DB
    $commentList.prepend("<li class='comment'>" + data.comment + "</li>" +
      "<span class='comment-update'>" + "Comment added for: " +
      "<span id='comment-update-city'>" + data.cityname + "</span>" + "</span>");
  });

  socket.on('load comments for city', function(docs) {
    // iterate through docs object and prepend comment value to dom
    // cool note: prepending automatically sorts comments in descending order
    // starting with most recent!
    $.each(docs, function ( index, value ) {
      $commentList.prepend("<li class='comment'>" + value.comment + "</li>");
    });
  });
});
