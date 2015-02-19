/* jshint node: true */

'use strict';

var express = require('express');
var drywall = require('./drywall');
var app = drywall.app;
app.api = require('./api');
app.use(express.static(__dirname + '/public'));

function formatDate(timestamp) {
	var date = new Date(timestamp);
	// The string we get from the server is UTC.
	return date.toLocaleString('en-GB').substring(4, 24);
}

function convertToCsv(body) {
	// If it won't parse (usually because it is an error message),
  //  just write the body so at least the user has something to debug
  var json;
	try {
		json = JSON.parse(body);
	} catch (e) {
		return body;
	}
	var csv = 'category, time, value\n';
	for (var i = 0; i < json.length; i++){
		var row = json[i];
		var value = row.value;
    // round to 2 d.p. if it is a number
    // but if it is a string leave it alone
		if (typeof value === 'number') {
			value = value.toFixed(2);
		}
		csv += row.category+', '+formatDate(row.time)+', '+value+'\n';
	}
	return csv;
}

app.all('/upload*', app.ensureAuthenticated);
app.get('/upload/', require('/home/enduser/aqua-app/views/upload/index').init);
app.post('/upload/', require('/home/enduser/aqua-app/views/upload/index').create);

app.get('/csv_download', function(req, res){
  var url = require('url');
	var urlParts = url.parse(req.url, true);
	var query = urlParts.query;
	var apiUrl = 'http://incredibleaquagdn.no-ip.info:8003/todmorden';
	var request = require('request');
  var category;
	var getParams = {
		'from': query.from,
		'to': query.to,
	};	
  // 'All' is a path parameter whereas an individual
  // category is a query parameter.
	if (query.category === 'all') {
		apiUrl += '/all';
	} else {
    getParams.category = query.category;
	}
	request.get({url: apiUrl, qs:getParams}, function (error, apiResponse, body) {
		if (!error && apiResponse.statusCode === 200) {
      try {
          category = query.category.replace(/ /g, '-');
      } catch (e) {
          category = 'UNKNOWN';
      }
			res.setHeader('Content-disposition', 'attachment; filename=todmorden-'+category+'.csv');
			res.setHeader('Content-type', 'text/csv');
			res.charset = 'UTF-8';
			var csv = convertToCsv(body);
			res.write(csv);
			res.end();
		} else {
			console.log(error);
		}
	});
});

drywall.start();
