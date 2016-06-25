var html            = require ('./html.js');


function sevenDayCellBuilder (data, i){
var sevenDayCell = '';
sevenDayCell += '<div class="seven-day">';
sevenDayCell += '<div class="icon-7">';
sevenDayCell += html.getIcon(data[i][0]);
// sevenDayCell += '<p>' + data[i][0] + '</p>' for troubleshooting non-matching icons
sevenDayCell += '</div>';
sevenDayCell += '<div class="seven-day-data">';
sevenDayCell += '<h3 class="temp">';
sevenDayCell += Math.round( data[i][1]) + '°F';
sevenDayCell += '</h3>';
sevenDayCell += '<h3>';
sevenDayCell += 'Feels like ' + Math.round(data[i][2])  + '°F';
sevenDayCell += '</h3>';
sevenDayCell += '<h3>';
sevenDayCell += data[i][3];
sevenDayCell += '</h3>';
sevenDayCell += '</div>';
sevenDayCell += '</div>';

return sevenDayCell;
}

module.exports.sevenDayCellBuilder = sevenDayCellBuilder;
