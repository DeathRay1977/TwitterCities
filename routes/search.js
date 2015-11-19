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
  var pins = [];
  var statuses = [];
  var imageURL = '';
  gmAPI.geocode(geocodeParams, function(err, result) {
    googleLoc = result.results[0].geometry.location;

    var params = {
      q: search_term,
      count: number,
      geocode: googleLoc.lat + "," + googleLoc.lng + ",5mi"
    };

    T.get('search/tweets', params, gotData);

    function gotData(err, data, response) {
      if (err) console.log(err);
      var tweets = data.statuses;



      for (var i = 0; i < tweets.length; i++) {

        if (tweets[i].geo) {
          pins.push({
            location: tweets[i].geo.coordinates[0] + ',' +
              tweets[i].geo.coordinates[1]
          });
          statuses.push(tweets[i].text);
        }
      }

      var mapParams = {
        center: location,
        zoom: 13,
        size: '500x500',
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

      imageURL = gmAPI.staticMap(mapParams); // return static map URL
    }
  });
  res.render('index', { pageData: { statuses: statuses, imageURL: imageURL }
});

});



module.exports = router;
