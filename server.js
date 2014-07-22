var express = require('express');
var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(allowCrossDomain);

app.use(express.static(__dirname + '/public'));

app.get('/csv_download', function(req, res){
	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var api_url = "http://localhost:8003/todmorden";
	if (query.sensor_name != 'all') {
		api_url += '/'+query.sensor_name;
	}	
	var request = require('request');
	var get_params = {
		'from': query.from,
		'to': query.to,
	};
	request.get({url: api_url, qs:get_params}, function (error, api_res, body) {
		if (!error && api_res.statusCode == 200) {
			var sensor_name = query.sensor_name.replace(/ /g, '-');
			console.log(sensor_name);
			res.setHeader('Content-disposition', 'attachment; filename=todmorden-'+sensor_name+'.csv');
			res.setHeader('Content-type', 'text/csv');
			res.charset = 'UTF-8';
			var csv = convert_to_csv(body);
			res.write(csv);
			res.end();
		} else {
			console.log(error);
		}
	});
});

function convert_to_csv(body) {
	var json = JSON.parse(body);
	var csv = "sensor name, date/time, reading\n";
	for (var i = 0; i < json.length; i++){
		var row = json[i];
		var value = row.reading_value;
	        // round to 2 d.p. if it is a number
                // but if it is a string leave it alone
		if (typeof value === 'number') {
			value = value.toFixed(2);
		}
		csv += row.sensor_name+", "+date_format(row.reading_time)+", "+value+"\n";
	}
	return csv;
}

// The string we get from the server is UTC.
// This should localise as well as formatting.
function date_format(timestamp) {
	var date = new Date(timestamp);
	return date.toLocaleString("en-GB").substring(4, 24);
}
var port = 80;
app.listen(port);
console.log("Aqua App Server running on "+port);

