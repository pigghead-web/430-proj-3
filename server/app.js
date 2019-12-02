// - REQUIRE -
// path, express, compression, favicon, cookieParser, bodyParser, mongoose, expressHandlebars,
// session, RedisStore, url, csurf
const path = require('path');
const express = require('express');
const compression = require('compression');
// const favicon = require('favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
// const RedisStore = require('connect-redis')(session);
// const url = require('url');
const csrf = require('csurf');

// Passport and user configuration
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User.js');

// - PRELIMINARY SETUP -
// port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// database url
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/';

// - MONGOOSE SETUP -
mongoose.connect(dbURL, (err) => {
  if (err) {
    console.log('Could not connect to database.');
    throw err;
  }
});

// - REDIS -
// const redisURL = {
//  hostname: 'redis-15954.c9.us-east-1-2.ec2.cloud.redislabs.com', // hostname from redis labs
//  port: 15954, // port number from redis labs
// };

// const redisPASS = 'PSEfCN5MHLQQio06HzhFHkiVaxWghsYU'; // password from redis labs

// Necessary because we are running this on heroku
// if (process.env.REDISCLOUD_URL) {
//  redisURL = url.parse(process.env.REDISCLOUD_URL);
//  redisPASS = redisURL.auth.split(':')[1];
// } // - END REDIS -

// Pull the module router
const router = require('./router.js');

// Setup express application
const app = express();

// Add /assets middleware layer
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

// Add favicon middleware layer
// * Favicon is used for creating small icons in the address bar/tab
// app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.disable('x-powered-by');

// Add compression middleware layer
app.use(compression());

// Add bodyParser middleware layer
// * Parse incoming requests before handlers
app.use(bodyParser.urlencoded({
  extended: true, // true > parse URL-encoded data with the qs library
}));

app.use(session({
  key: 'sessionid', // name of cookie, track when requests are made
  //  store: new RedisStore({
  //    host: redisURL.hostname,
  //    port: redisURL.port,
  //    pass: redisPASS,
  //  }),
  secret: 'qcTyroHg', // use this string as a seed for hashing
  resave: true, // refresh the key to keep it active
  saveUninitialized: true, // sessions even when not logging in
  cookie: {
    httpOnly: true,
  },
}));

// Set handlebar's default
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));

// Set the view engine we are using to handlebars
app.set('view engine', 'handlebars');

// Get the views folder from the hierarchy
app.set('views', '{__dirname}/../views');

// Add cookieParser middleware layer
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

// Initialize the passport from UserSchema


// Add csrf middleware layer
// * Must come after cookieParser
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing CSRF token');
  return false;
});

// Handle the possible endpoints
router(app);

app.listen(port, (err) => { // Start the server
  if (err) {
    throw err;
  }

  console.log(`Listening on port: ${port}`);
});
