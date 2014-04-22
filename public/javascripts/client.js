// connect to the socket server
var socket = io.connect();

var $grabCityName = $('#cityName');
var $getWeatherButton = $('#get-weather');

$getWeatherButton.on('click', function(e) {
  e.preventDefault;
  socket.emit('send city name', { name: $grabCityName.val() });
  $grabCityName.val('');
});

if we get an "info" emit from the socket server then console.log the data we recive
socket.on('info', function (data) {
    console.log(data);
});
