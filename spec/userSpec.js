describe("User", function() {
  var mongoose = require('mongoose');
  var User = require('../src/user');
  var testUser;
  var testUsername = 'Jimbob2000';
  var goodPassword = 'Password123';
  var badPassword = 'IAmHacker';
  var connStr = 'mongodb://localhost:27017/mongoose-bcrypt-test';

  mongoose.connect(connStr, function(err) {
    if (err) throw err;
  });

  beforeEach(function() {
    User.remove({}, function(err) {
      if (err) throw err;
    });

    // create a user a new user
    var testUser = new User({
      username: testUsername,
      password: goodPassword
    });

    // save user to database
    testUser.save(function(err) {
      if (err) throw err;
    });
  });

  it('Confirms a matching password', function() {
    User.findOne({
      username: testUsername
    }, function(err, user) {
      if (err) throw err;
        // test a matching password
        user.comparePassword(goodPassword, function(err, same) {
          if (err) throw err;
          expect(same).toBe(true);
        });
    });
  });

  it('Does not match a bad password', function() {
    User.findOne({
      username: testUsername
    }, function(err, user) {
      if (err) throw err;
      expect(function() {
        // test a failing password
        user.comparePassword(badPassword, function(err, isMatch) {
          if (err) throw err;
        });
      }).not.toThrowError();
    });
  });
});
