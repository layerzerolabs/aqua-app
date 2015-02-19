/* js hint node: true */

var request = require('request');

var baseUrl = 'http://localhost:8003';
var apiKey = '';

module.exports.post = function(url, data, callback) {
  request.post(baseUrl + url, data, callback);
};


