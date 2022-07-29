"use strict";

if ( process.env.NODE_ENV !== "production" ) {

  require('dotenv').config();

}

require('dotenv').config();

const express = require("express");
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const helmet = require('helmet');
const featurePolicy = require('feature-policy');
const getRawBody = require('raw-body');
const toobusy = require('toobusy-js');
const contentType = require('content-type');
const csrf = require('csurf');
const hpp = require('hpp');
const expectCt = require('expect-ct');

const mongoSanitize = require('express-mongo-sanitize');

const MongoDBStore = require("connect-mongo");

const logger = require('./logger/logger.js');

const { SERVER_IP, API_URL, SERVER_URL } = require('./config/config.js');

// MONGO STUFF 
const dbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/efood';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const csrfProtection = csrf();

module.exports.csrfProtection = csrfProtection;

// DEFINE APP ROUTES
const orderRoutes = require('./routes/order.js');
const usersRoutes = require('./routes/users.js');
const { GENERAL } = require('./config/statusCodes.js');
const { strings, languages } = require('./config/strings.js');
const { renderLimiter } = require('./middleware/limiters.js');

// EJS STUFF
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
  replaceWith: '_'
}));

app.use( hpp() );
app.use(expectCt({ enforce: true, maxAge: 123 }));

const secret = process.env.SECRET;
const port = process.env.PORT || 8000;

const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60
});

const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  name: 'sessionID',
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

const corsOptions = {
  origin: [`${ SERVER_URL }:${ port }`],
  optionsSuccessStatus: 200
}

app.use(function(req, res, next) {
  
  if ( toobusy() ) {
  
    res.status(503).send("Server Too Busy");
  
  } else {
  
    next();
  
  }

});

app.use(session(sessionConfig));

app.use(helmet());

const stylesSources = [
  ''
];

app.use(helmet.contentSecurityPolicy({
  useDefaults: false,
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", ...stylesSources],
    fontSrc: ["'self'"],
    connectSrc: ["'self'", `${ API_URL }`]
  }
}));

app.use(helmet.dnsPrefetchControl({
  allow: false 
}));

app.use(helmet.frameguard({
  action: 'deny' 
}));

app.use(helmet.hsts({
  maxAge: 60 * 24 * 60 * 60
}));

app.use(helmet.xssFilter());

app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));

app.use(
  featurePolicy({
    features: { 
      accelerometer: ["'none'"],
      ambientLightSensor: ["'none'"],
      autoplay: ["'none'"],
      camera: ["'none'"],
      encryptedMedia: ["'none'"],
      fullscreen: ["'none'"],
      geolocation: ["'none"],
      gyroscope: ["'none'"],
      vibrate: ["'none'"],
      payment: ["'none"],
      syncXhr: ["'none'"]
    }
  }
));

// PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
app.use(cors( corsOptions ));
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/order', orderRoutes);
app.use('/', usersRoutes);
app.get('/', ( req, res ) => {

  res.redirect('/shop');

});
app.get('/*', csrfProtection, renderLimiter, ( req, res ) => {

  const allStrings = strings;

  const languageNumber = req.user ? languages.get( req.user.preferences.language ) : 0;

  res.render('shop/index', { 
    user: req.user, 
    csrfToken: req.csrfToken(),
    language: languageNumber,
    strings: allStrings
  });

});

app.use((err, req, res, next) => {
  
  const { statusCode = 500 } = err;

  if (!err.message) err.message = 'Server Error';

  // console.log(statusCode);

  // if (err.code !== 'EBADCSRFTOKEN') {



  // }

  logger.info( err.stack );
  
  res.status( statusCode ).send(JSON.stringify({ status: GENERAL.ERROR }));

});

// LISTEN

app.listen(port, () => {

  logger.info("Client Server Started");

});