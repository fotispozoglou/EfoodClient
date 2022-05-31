if ( process.env.NODE_ENV !== "production" ) {

  require('dotenv').config();

}

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

const MongoDBStore = require("connect-mongo");

const { SERVER_IP } = require('./config/config.js');

// MONGO STUFF 
const dbUrl =  process.env.DB_URL || 'mongodb://localhost:27017/efood'; // process.env.DB_URL

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// DEFINE APP ROUTES
const indexRoutes = require('./routes/index.js');
const shopRoutes = require('./routes/shop.js');
const orderRoutes = require('./routes/order.js');
const usersRoutes = require('./routes/users.js');

// EJS STUFF
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const secret = 'thisshouldbeabettersecret!'; // process.env.SECRET

const sessionConfig = {
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store: MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
  })
}

const corsOptions = {
  origin: [`https://efood-admin.herokuapp.com/`],
  optionsSuccessStatus: 200 
}

app.use(session(sessionConfig));

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
})

app.use('/', indexRoutes);
app.use('/shop', shopRoutes);
app.use('/order', orderRoutes);
app.use('/', usersRoutes);

// LISTEN

const port = process.env.PORT;

app.listen(port, () => {

  console.log("Client Server Started");

});