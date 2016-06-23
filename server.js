
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
      console.log(lat,lng, forecastKey);
      var forecast = getForecast + lat + ',' + lng;
      console.log ("This is forecast", forecast);
      request (forecast, function (error, response, body){
        if (!error && response.statusCode == 200){
          var forecastData = JSON.parse(body)
          console.log ('This is forecastData', forecastData);
          var report = [

          forecastData.currently.summary,
          'temp: ' + forecastData.currently.temperature,
          'humidity: ' + forecastData.currently.humidity
        ]
          res.send(report);
        }
      })
    }
  });








});

app.listen(port, function(){
  console.log('Server on port ',  port, '//', new Date());
});
