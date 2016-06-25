
var bodyParser      = require ('body-parser');
var dotenv          = require ('dotenv').config();
var html            = require ('./html/html.js');
var hourlyHTML      = require ('./html/hourly.js');
var express         = require ('express');
var logger          = require ('morgan');
var path            = require ('path');
var request         = require ('request');
var sevenDaysHTML   = require ('./html/sevendays.js');


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
      var latlng = JSON.parse(body);
      var formattedAddress =latlng.results[0].formatted_address;
      var location = latlng.results[0].geometry.location;
      var lat = location.lat;
      var lng = location.lng
      var forecast = getForecast + lat + ',' + lng;
      request (forecast, function (error, response, body){
        if (!error && response.statusCode == 200){
          // all the forecast data
          var forecastData = JSON.parse(body)
          //all data of .daily
          var dailyReport = forecastData.daily;
          //array of relevant data for .daily
          var everyDay = dailyReport.data.map(function (data){
        	   var cherryPickData = [ data.icon,  data.temperatureMax,  data.apparentTemperatureMax,  data.summary]
        	  return cherryPickData;
          });
          //all data of .hourly
          var todaysReport = forecastData.hourly;
          //array of relevenat data for .hourly
          var everyHour = todaysReport.data.map(function(data){
            var time = new Date (data.time*1000);
            var justTheHour = hourlyHTML.timeFix(time);
            var cherryPickData = [justTheHour, data.icon, data.summary, data.temperature
            ]
            return cherryPickData;
          });

          //build page
          var weather = html.builder();
          var sevenDayContainer = '<h2> 7 Day Forecast for ' + formattedAddress + '</h2>';
          sevenDayContainer +='<div id="seven-day">';
          for (var i=0; i < 7; i++){
            sevenDayContainer += sevenDaysHTML.sevenDayCellBuilder(everyDay, i);
          }
          sevenDayContainer +="</div>";

          weather += sevenDayContainer;

          var hourlyContainer = '<h2 id="center"> Hourly forcast </h2>';
          hourlyContainer += '<div id="hourly">';
          for (var j=0; j < 24; j++){
            hourlyContainer += hourlyHTML.hourlyCellBuilder(everyHour, j);
          }
          hourlyContainer +="</div>";
          weather += hourlyContainer;
          weather += html.closer();
          res.send(weather);
        }
      });
    }
  });
});


app.listen(port, function(){
  console.log('Server on port ',  port, '//', new Date());
});
