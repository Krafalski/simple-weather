function htmlBuilder (){
  var html = '<!DOCTYPE html>';
  html += '<html><head><meta charset="utf-8">';
  html += '<title>Simple Weather</title>';
  html += "<link href='https://fonts.googleapis.com/css?family=Arimo:400,700,400italic|Raleway:400,700' rel='stylesheet' type='text/css'>";
  html +='<link href="normalize.css" rel="stylesheet">';
  html += '<link href="styles.css" rel="stylesheet">';
  html += '</head>';
  html += '<body>';
  html += '<div id="container">';
  html += '<div id="wrapper">';
  html += '<h1>A Simple Weather App</h1>';
  html += '<div>';
  html += '<form action="/weather" method="get">';
  html += '<span class="help-block">Check out another location </span>';
  html += '<input id="address" name="address" type="text" placeholder="zipcode" class="input" required="">';
  html += '<label class="search" for="submit"></label>';
  html += '<button id="submit" type="submit" class=""></button>';
  html += '</form>';
  html += '</div>';
  return html;
};

function htmlCloser (){
var html =  '</div>';//close wrapper
html += '</div>'; //close container
html += '<script src="app.js"></script>'
html += '</body>'
html += '</html>'
return html;
};

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
      image = '<img src="cloudy4.png" alt="cloudy">'
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
};
 return image;
};

module.exports.builder = htmlBuilder;
module.exports.closer = htmlCloser;
module.exports.getIcon = getIcon;
