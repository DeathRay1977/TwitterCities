var express = require('express');
var router = express.Router();
var GoogleMapsAPI = require('googlemaps');

var publicConfig = {
  key: 'AIzaSyAyzrybSa0pye0Jsy2v4D5QOK3FIASih14',
  stagger_time: 1000, // for elevationPath
  encode_polylines: false,
  secure: true // use https
};
var gmAPI = new GoogleMapsAPI(publicConfig);

var Twit = require('twit');
var config = require('../src/twitter-config');
var T = new Twit(config);

/* Handle Login POST */
router.post('/', function(req, res) {
  var search_term = req.param('search_term');
  var location = req.param('location');
  var number = req.param('number');
  // geocode API
  var geocodeParams = {
    "address": location
  };
  var latitude = '';
  var longitude = '';
  var googleLoc = {};
  gmAPI.geocode(geocodeParams, function(err, result) {
    googleLoc = result.results[0].geometry.location;

    var params = {
      q: search_term,
      count: number,
      geocode: googleLoc.lat + "," + googleLoc.lng + ",5mi"
    };

    console.log(params);
    T.get('search/tweets', params, gotData);

    function gotData(err, data, response) {
      if (err) console.log(err);
      var tweets = data.statuses;
      var pins = [];
      for (var i = 0; i < tweets.length; i++) {
        console.log(tweets[i].text);
        console.log(tweets[i].geo);

        if (tweets[i].geo) {
          pins.push({
            location: tweets[i].geo.coordinates[0] + ',' +
              tweets[i].geo.coordinates[1]
          });
        }
      }
      var mapParams = {
        center: location,
        zoom: 13,
        size: '500x400',
        maptype: 'roadmap',
        markers: pins,
        style: [{
          feature: 'road',
          element: 'all',
          rules: {
            hue: '0x00ff00'
          }
        }],
      };
      console.log(gmAPI.staticMap(mapParams)); // return static map URL
    }
  });
  res.redirect('/');
});

module.exports = router;
