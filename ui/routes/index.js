var express = require('express');
var router  = express.Router(),
    request = require('request'),
    view    = require('../views/views');

router.get('/ping', function(req, res) {
  res.sendStatus(201);
});

router.get('/', function(req, res){
  request('http://localhost:3001/hotel', function(error, response, body){
    var payload = JSON.parse(response.body);
    var options = {
      uri: 'http://localhost:3004/validate',
      method: 'POST',
      json: {
        "token": req.cookies.token
      }
    };

    request(options, function(error, response, body){
      if(response.statusCode == 200){
          payload.auth = true;
      } else {
          payload.auth = false;
      }

      view.index(payload, function(render){
        res.send(render);
      });
    });
  });
});

router.get('/hotel/:id', function(req, res){
  var hotelOptions = {
    headers: {
      'Accept': 'application/json',
    },
    uri: 'http://localhost:3001/hotel/' + req.params.id,
    method: 'GET'
  }

  request(hotelOptions, function (error, response) {
    var payload = JSON.parse(response.body);
    var options = {
      uri: 'http://localhost:3004/validate',
      method: 'POST',
      json: {
        "token": req.cookies.token
      }
    };

    request(options, function(error, response, body){
      if(response.statusCode == 200){
          payload.auth = true;
      } else {
          payload.auth = false;
      }

      payload.hotelid = req.params.id;
      view.hotel(payload, function(render){
        res.send(render);
      });
    });
  });
});

router.get('/search', function(req, res){
  request({
    headers: {
      'Accept': 'application/json',
    },
    uri: 'http://localhost:3002/search?keyword=' + req.query.keyword,
    method: 'GET'
  }, function (error, response) {
    view.search(JSON.parse(response.body), function(render){
      res.send(render);
    });
  });
})

module.exports = router;