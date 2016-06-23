
var express         = require ('express');
var logger          = require ('morgan');
var path            = require ('path');

var app             = express();
var port            = 3000;

app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(port, function(){
  console.log('Server on port ',  port, '//', new Date());
})
