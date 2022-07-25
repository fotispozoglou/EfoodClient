const rateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

const renderLimiter = rateLimit({
  store: new MongoStore({
    uri: 'mongodb://127.0.0.1:27017/efood',
    user: '',
    password: '',
    expireTimeMs: 60 * 60 * 1000,
    errorHandler: console.error.bind(null, 'rate-limit-mongo')
  }),
  max: 300,
  windowMs: 60 * 60 * 1000
});

const loginLimiter = rateLimit({
  store: new MongoStore({
    uri: 'mongodb://127.0.0.1:27017/efood',
    user: '',
    password: '',
    expireTimeMs: 60 * 60 * 1000,
    errorHandler: console.error.bind(null, 'rate-limit-mongo')
  }),
  max: 4,
  windowMs: 60 * 60 * 1000
});

const registerLimiter = rateLimit({
  store: new MongoStore({
    uri: 'mongodb://127.0.0.1:27017/efood',
    user: '',
    password: '',
    expireTimeMs: 7 * 24 * 60 * 60 * 1000,
    errorHandler: console.error.bind(null, 'rate-limit-mongo')
  }),
  max: 1,
  windowMs: 7 * 24 * 60 * 60 * 1000
});

module.exports = {
  renderLimiter,
  loginLimiter,
  registerLimiter
};