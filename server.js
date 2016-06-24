
var bodyParser      = require ('body-parser');
var dotenv          = require ('dotenv').config();
var express         = require ('express');
var logger          = require ('morgan');
var path            = require ('path');
var request         = require ('request');


var app             = express();
var port            = 3000;


var geolocateKey    = process.env.GOOGLEKEY;
var forecastKey     = process.env.FORECASTKEY;

var geolocate       = "https://maps.googleapis.com/maps/api/geocode/json?address="
var getForecast        = " https://api.forecast.io/forecast/"+ forecastKey+'/';

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/images'));

app.use (logger('short'));


app.get('/', function (req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/weather', function (req, res){
  var weatherZip = req.query.address;
  var queryLocation = geolocate + weatherZip + '&' + geolocateKey;
  request(queryLocation, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var latlng = JSON.parse(body)
      var location = latlng.results[0].geometry.location;
      var lat = location.lat;
      var lng = location.lng
      // console.log(lat,lng, forecastKey);
      var forecast = getForecast + lat + ',' + lng;
      // console.log ("This is forecast", forecast);
      request (forecast, function (error, response, body){
        if (!error && response.statusCode == 200){
          var forecastData = JSON.parse(body)
          // console.log ('This is forecastData', forecastData);
          var dailyReport = forecastData.daily;
          var everyDay = dailyReport.data.map(function (data){
        	   var cherryPickData = [ data.icon, data.summary,  'The temperature is ' + data.temperatureMax ,'The temperature feels like '+  data.apparentTemperatureMax]
        	  return cherryPickData;
          });
          var todaysReport = forecastData.hourly;
          var everyHour = todaysReport.data.map(function(data){
            var time = new Date (data.time*1000);
            var readableTime = time.toString();
            var cherryPickData = [readableTime, data.icon, data.summary, data.temperature, data.apparentTemperature
            ]
            return cherryPickData;
          })

          var weather = htmlBuilder();
          var sevenDayContainer = '<h2> 7 Day Forecast for ' + req.query.address + '</h2>';
          sevenDayContainer +='<div id="seven-day">'

          for (var i=0; i < 7; i++){
            sevenDayContainer += sevenDayCellBuilder(everyDay, i);
          }
          sevenDayContainer +="</div>";
          weather += sevenDayContainer;

          //res.send('<h2>' + everyDay + '</h2>' + '<h3>' + everyHour + '</h3>');
          // res.send(everyDay);
          res.send(weather);
        }
      })
    }
  });


function htmlBuilder (){
  var html = '<!DOCTYPE html>';
  html += '<html><head><meta charset="utf-8">';
  html += '<title>Simple Weather</title>';
  html += "<link href='https://fonts.googleapis.com/css?family=Arimo:400,700,400italic|Raleway:400,700' rel='stylesheet' type='text/css'>"
  html += '<link href="styles.css" rel="stylesheet">';
  html += '</head>';
  html += '<body>';
  html += '<div id="container">';
  html += '<div id="wrapper">';
  html += '<h1>Welcome to the Simple Weather App!</h1>';
  html += '<div id="search-container">';
  html += '<div class="search">';
  html += '<label class="search" for="zip"></label>';
  html += '<div>';
  html += '<form action="/weather" method="get">';
  html += '  <span class="help-block">Enter the zipcode for your location </span>';
  html += '<input id="address" name="address" type="text" placeholder="zipcode" class="input" required="">';
  html += '</div>';
  html += '</div>';
  html += '<label class="search" for="submit"></label>';
  html += '<button id="submit" type="submit" class="">Weather Me!</button>';
  html += '</form>';
  html += '</div>';

  return html;
};

function sevenDayCellBuilder (data, i){
var sevenDayCell = '';
sevenDayCell += '<div class="seven-day">';
sevenDayCell += '<div class="icon-7">';
sevenDayCell += getIcon(data[i][0]);
// sevenDayCell += '<p>' + data[i][0] + '</p>' for troubleshooting non-matching icons
sevenDayCell += '</div>';
sevenDayCell += '<div class="seven-day-data">';
sevenDayCell += '<h3>';
sevenDayCell += data[i][1];
sevenDayCell += '</h3>';
sevenDayCell += '<h3>';
sevenDayCell += data[i][2];
sevenDayCell += '</h3>';
sevenDayCell += '<h3>';
sevenDayCell += data[i][3];
sevenDayCell += '</h3>';
sevenDayCell += '</div>';
sevenDayCell += '</div>';

return sevenDayCell;
}


function getIcon (icon){
  switch (icon){
    case 'clear-day':
      image = '<img src="clear-day.png" alt="clear-day">'
      break;
    case 'clear-night':
      image = '<img src="clear-night.png" alt="clear-night">'
      break;
    case 'rain':
      image = '<img src="rain.png" alt="rain">'
      break;
    case 'snow':
      image = '<img src="snow.png" alt="snow">'
      break;
    case 'sleet':
      image = '<img src="sleet.png" alt="sleet">'
      break;
    case 'wind':
      image = '<img src="wind.png" alt="wind">'
      break;
    case 'fog':
      image = '<img src="fog.png" alt="fog">'
      break;
    case 'cloudy':
      image = '<img src="cloudy.png" alt="cloudy">'
      break;
    case 'partly-cloudy-day':
      image = '<img src="partly-cloudy-day.png" alt="partly-cloudy-day">'
      break;
    case 'partly-cloudy-night':
      image = '<img src="partly-cloudy-night.png" alt="partly-cloudy-night">'
      break;
    default:
      image = '<img src="default.png" alt="default">'
      break;
}
 return image;
}


});

app.listen(port, function(){
  console.log('Server on port ',  port, '//', new Date());
});
