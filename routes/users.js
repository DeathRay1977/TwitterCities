var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {
    message: req.flash('message')
  });
});

/* Handle Logout */
router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    message: req.flash('message')
  });
});

/* Handle Login POST */
router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true

}));

/* Handle Registration POST */
router.post('/signup', passport.authenticate('signup', {
  successRedirect: '/',
  failureRedirect: '/signup',
  failureFlash: true,
  successFlash: true

}));
module.exports = router;
