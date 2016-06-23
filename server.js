
var bodyParser      = require ('body-parser');
var dotenv          = require ('dotenv').config();
var express         = require ('express');
var logger          = require ('morgan');
var path            = require ('path');
var request         = require ('request');


var app             = express();
var port            = 3000;

var geolocate       = "https://maps.googleapis.com/maps/api/geocode/json?address="

var geolocateKey    = process.env.GOOGLEKEY;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));

app.use (logger('short'));


app.get('/', function (req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/weather', function (req, res){
  var weatherZip = req.query;
  weatherZip = weatherZip.address;
  var query = geolocate + weatherZip + '&' + geolocateKey;
  var query1 = request(query, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var data = JSON.parse(body)
    var location = data.results[0].geometry.location;
    console.log(location)

  }
})
  // var body = request(query1);
  // console.log(query);
  res.send('working on it!')


});

app.listen(port, function(){
  console.log('Server on port ',  port, '//', new Date());
});
