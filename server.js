
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
          console.log(weather);
          var sevenDayContainer ='<div id="seven-day">'
          for (var i=0; i < 7; i++){
          sevenDayContainer += sevenDayCellBuilder(everyDay, i);
          }
          sevenDayContainer +="</div>";
          weather = sevenDayContainer;

          //res.send('<h2>' + everyDay + '</h2>' + '<h3>' + everyHour + '</h3>');
          // res.send(everyDay);
          res.send(weather);
        }
      })
    }
  });


function htmlBuilder (){
  var html = '<div>could be container div';
  return html;
};

function sevenDayCellBuilder (data, i){
var sevenDayCell = '';
sevenDayCell += '<div class="seven-day">';
sevenDayCell += '<div class="icon-7">';
sevenDayCell += data[i][0];
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


});

app.listen(port, function(){
  console.log('Server on port ',  port, '//', new Date());
});
