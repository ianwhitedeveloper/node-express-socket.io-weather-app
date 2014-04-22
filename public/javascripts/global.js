
// // Get city data
// $(function(){
//   // Initialize skycons
//   var skycons = new Skycons({"color": "black"});

//   // Event handler for clicking Get Weather button
//   $("#get-weather").on('click', function (e) {
//     e.preventDefault();
//     console.log('Fetching weather...');

//     // clear error messages if any
//     $('#error').hide();
//     // Fade out main display so it can fade back in
//     $('.container.main').fadeOut(200);

//     // Grab name of city from input field
//     var cityName = $('#cityName').val();

//     // Interpolate city name into API url to gather weather data
//     var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&mode=json&units=imperial";

//     // Dynamically update a banner heading with name of city
    // $.ajax({
    //     url: weatherUrl,
    //     type: "get",
    //     dataType: "json",
    //     success: function (data) {
    //       console.log(data.cod);
    //       // Only show results if what is typed in city name
    //       // input is valid
    //       if (data.cod === 200) {
    //         $('#cityNameBanner').text(cityName + " Weather");
    //         $('.container.main').fadeIn(200);
    //         // Update named fields with API weather data for specific city
    //         $('#humidity').text(data.main.humidity + "%");
    //         $('#pressure').text(data.main.pressure);
    //         $('#temperature').text(data.main.temp);
    //         $('#high').text(data.main.temp_max);
    //         $('#low').text(data.main.temp_min);

    //         // Clear city weather input value
    //         $('#cityName').val('');
//             var weatherCondition = data.weather[0].main
//             console.log(weatherCondition);

//             // Display appropriate Skycon based on current weather.
//             // May not always work--unsure of all
//             // possible weather descriptions at the moment
//             if (weatherCondition.indexOf("Rain") != -1) {
//               skycons.add("icon1", Skycons.RAIN);
//             } else if (weatherCondition.indexOf("Clear") != -1) {
//               skycons.add("icon1", Skycons.CLEAR_DAY);
//             } else if (weatherCondition.indexOf("Wind") != -1) {
//               skycons.add("icon1", Skycons.WIND);
//             } else if (weatherCondition.indexOf("Fog") != -1) {
//               skycons.add("icon1", Skycons.FOG);
//             } else if (weatherCondition.indexOf("Clouds") != -1) {
//               skycons.add("icon1", Skycons.CLOUDY);
//             } else if (weatherCondition.indexOf("Snow") != -1) {
//               skycons.add("icon1", Skycons.SNOW);
//             } else if (weatherCondition.indexOf("Mist") != -1) {
//               skycons.add("icon1", Skycons.FOG);
//             }

//             // Animate Skycons
//             skycons.play();
//           } else {
//             // Return what was typed into city name input
//             console.log("Sorry, please enter a city");
//             $('#error').fadeIn(200).html("Sorry, " + cityName + " is either not a city or is spelled incorrectly.");
//             $('#cityName').val('');
//           }
//         },
//         error: function(xhr, status) {
//           // In case there's an error on the API side
//           console.log("There was an error");
//           $('#error').fadeIn(200).html("There was an error, please try again later");
//         }
//     });
//   });
// });

