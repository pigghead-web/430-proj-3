// - REQUIRE -
const mongoose = require('mongoose');
const crypto = require('crypto');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  
  password: {
    type: String,
  }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);