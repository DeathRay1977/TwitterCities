var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SearchSchema = require('./search');
var bcrypt = require('bcryptjs');
SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  username:  { type: String, required: true, index: { unique: true } },
  password:  { type: String, required: true },
  email:     { type: String, required: true },
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  searchItems: [SearchSchema]
});

UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
