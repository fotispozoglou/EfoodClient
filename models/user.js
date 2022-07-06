const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const options = {
  errorMessages: {
    MissingPasswordError: 'missing_password',
    AttemptTooSoonError: 'account_locked',
    TooManyAttemptsError: 'too_many_attemps',
    NoSaltValueStoredError: 'no_shalt_value',
    IncorrectPasswordError: 'password_or_username_incorrect',
    IncorrectUsernameError: 'password_or_username_incorrect',
    MissingUsernameError: 'missing_username',
    UserExistsError: 'user_already_exists'
  }
};

const UserSchema = new Schema({
  name: String,
  phone: String,
  preferences: {
    privateName: Boolean,
    privatePhone: Boolean
  }
});

UserSchema.plugin( passportLocalMongoose, options );

module.exports = mongoose.model('User', UserSchema);