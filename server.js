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
	var request = require('request');
	var get_params = {
		'from': query.from,
		'to': query.to,
	};	
    // "All" is a path parameter whereas an individual
    // category is a query parameter.
	if (query.category == 'all') {
		api_url += '/all';
	} else {
	    get_params.category = query.category;
	}
	request.get({url: api_url, qs:get_params}, function (error, api_res, body) {
		if (!error && api_res.statusCode == 200) {
            var sensor_name;
            try {
                category = query.category.replace(/ /g, '-');
            } catch (e) {
                category = 'UNKNOWN';
            }
			res.setHeader('Content-disposition', 'attachment; filename=todmorden-'+category+'.csv');
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
	// If it won't parse (usually because it is an error message),
    //  just write the body so at least the user has something to debug
	try {
		var json = JSON.parse(body);
	} catch (e) {
		return body;
	}
	var csv = "category, time, value\n";
	for (var i = 0; i < json.length; i++){
		var row = json[i];
		var value = row.value;
	        // round to 2 d.p. if it is a number
                // but if it is a string leave it alone
		if (typeof value === 'number') {
			value = value.toFixed(2);
		}
		csv += row.category+", "+date_format(row.time)+", "+value+"\n";
	}
	return csv;
}

function date_format(timestamp) {
	var date = new Date(timestamp);
	// The string we get from the server is UTC.
	return date.toLocaleString("en-GB").substring(4, 24);
}

var port;
if (typeof process.argv[2] == 'undefined') {
    port = 80;
} else {
    port = process.argv[2];
}

app.listen(port);
console.log("Aqua App Server running on "+port);

