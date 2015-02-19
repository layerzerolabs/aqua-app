/* jshint node: true */

'use strict';

exports.init = function(req, res){
  res.render('upload/index');
};

exports.create = function(req, res){
  var workflow = req.app.utility.workflow(req, res); 
  workflow.on('send data', function() {
    req.app.api.post('/todmorden', req.body, function(err, response, body) {
      if (err) {
        workflow.emit('exception', err);
      } else {
          console.log(body);
        body = JSON.parse(body);
        workflow.outcome.success = body.success;
        workflow.outcome.errors = body.errors;
        workflow.emit('response');
      }
    });
  });
  workflow.emit('send data');
};
