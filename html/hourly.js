var html            = require ('./html.js');

function hourlyCellBuilder(data, j){
  var hourlyCell='';
  hourlyCell += '<div id="each-hour">';
  hourlyCell += '<div class="time">';
  hourlyCell += data[j][0];
  hourlyCell += '</div>';
  hourlyCell += '<div class="icon-24">';
  hourlyCell += html.getIcon(data[j][1]);
  hourlyCell += '</div>';
  hourlyCell += '<div class="hourly-data">';
  hourlyCell += '<h4>';
  hourlyCell += data[j][2];
  hourlyCell += '</h4>';
  hourlyCell += '<h4>';
  hourlyCell += Math.round(data[j][3])  + '°F';
  hourlyCell += '</h4>';
  hourlyCell += '</div>';
  hourlyCell += '</div>';

  return hourlyCell;

}

function timeFix (mTime){
  var readableTime = mTime.toString();
  var justTheHour = readableTime.split(' ');
  justTheHour = justTheHour[4];
  var sliceTime = parseInt(justTheHour.slice(0,2));
  var convertTime;
  if (sliceTime > 12){
    convertTime = sliceTime - 12;
    convertTime = convertTime +  ":00 pm";
  }  else if (sliceTime == 0){
    convertTime = "12:00 am";
  } else if (sliceTime === 12){
    convertTime = sliceTime - 0;
    convertTime = sliceTime + ":00 pm";
  }  else if (sliceTime < 12 ){
    convertTime = sliceTime + ":00 am";
  } else {console.log('something has gone horribly wrong');}
  return convertTime;
}

module.exports.hourlyCellBuilder = hourlyCellBuilder;
module.exports.timeFix = timeFix;
