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
	var api_url = "http://localhost:8001/todmorden";
	if (query.sensor_name != 'all') {
		api_url += '/'+query.sensor_name;
	}	
	var request = require('request');
	var get_params = {
		'from': query.from,
		'to': query.to,
	};
	request.get({url: api_url, qs:get_params}, function (error, api_res, body) {
		console.log("statusCode: ", api_res.statusCode);
		console.log(body);
		if (!error && api_res.statusCode == 200) {
			console.log(query.sensor_name);
			res.setHeader('Content-disposition', 'attachment; filename=todmorden-'+query.sensor_name+'.csv');
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
	for (var i = 0; i < json.rows.length; i++){
		var row = json.rows[i];
		csv += row.sensor_name+", "+date_format(row.reading_time)+", "+row.reading_value.toFixed(2)+"\n";
	}
	return csv;
}

function date_format(timestamp) {
	return timestamp.substring(0,19).replace("T", " ");
}

app.listen(8080);
console.log("Server running at http://127.0.0.1:8080/");

