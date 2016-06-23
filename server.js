
var dotenv          = require ('dotenv').config();
var express         = require ('express');
var logger          = require ('morgan');
var path            = require ('path');
var request         = require ('request');


var app             = express();
var port            = 3000;

var geolocate       = "https://maps.googleapis.com/maps/api/geocode/json?address="

var geolocateKey    = process.env.GOOGLEKEY;


app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));

app.use (logger('short'));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/weather', function (req, res){
  var weatherZip = req.query;
  console.log(weatherZip.address)
  weatherZip = weatherZip.address;
  var query = geolocate + weatherZip + '&' + geolocateKey
  var body = request(query);
  res.redirect(query)


});

app.listen(port, function(){
  console.log('Server on port ',  port, '//', new Date());
});
