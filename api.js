/* js hint node: true */

var request = require('request');
var settings = require('./api-settings');

var apiUrl = settings.baseUrl + ':' + settings.port;
var apiKeySuffix = '?api-key=' + settings.apiKey;

module.exports.post = function(resourceUrl, data, callback) {
  request.post(apiUrl + resourceUrl + apiKeySuffix, data, callback);
};


