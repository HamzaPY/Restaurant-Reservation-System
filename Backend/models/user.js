var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    profilePic: {
      type: String,
        default: ''
    },
    firstname: {
        type: String,
          default: ''
      },
      lastname: {
        type: String,
          default: ''
      },
      email: {
        type: String,
        default: ''
      },
      admin:  {
        type: Boolean,
        default: false
    },
    emailVerify:  {
      type: Boolean,
      default: false
  },
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', User);