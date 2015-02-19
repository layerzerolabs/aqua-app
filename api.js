/* js hint node: true */

var request = require('request');
var settings = require('./api-settings');

var apiUrl = settings.baseUrl + ':' + settings.port;
var apiKeySuffix = '?api_key=' + settings.apiKey;

module.exports.post = function(resourceUrl, data, callback) {
  var options = {
    uri: apiUrl + resourceUrl + apiKeySuffix,
    method: 'POST',
    json: data
  };
  request(options, callback);
};


