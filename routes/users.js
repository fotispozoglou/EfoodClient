const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync.js');
const users = require('../controllers/users.js');
const { isLoggedIn, validatePreference } = require('../middleware/users.js');
const { registerLimiter, loginLimiter } = require('../middleware/limiters.js');
const { csrfProtection } = require('../app.js');
const { GENERAL } = require('../config/statusCodes.js');

router.route('/register')
  .post(
    catchAsync( users.register )
  );

router.route('/login')
  .post( 
    catchAsync( users.login ),
    loginLimiter,
    ( req, res ) => {

      res.send(JSON.stringify({ status: GENERAL.SUCCESS, authenticated: false }));

    }
  );

router.route('/info')
  .get( csrfProtection, isLoggedIn, catchAsync( users.getUserInfo ) )
  .put( csrfProtection, isLoggedIn, catchAsync( users.saveUserInfo ) );

router.route('/preferences')
  .get( isLoggedIn, catchAsync( users.getPrivacySettings ) )
  .put( csrfProtection, isLoggedIn, validatePreference, catchAsync( users.updatePrivacySettings ) );

router.post('/language', csrfProtection, isLoggedIn, catchAsync( users.changeUserLanguage ));

router.route('/password')
  .put( csrfProtection, isLoggedIn, catchAsync( users.updateUserPassword ) );

router.route('/deleteUser')
  .post( csrfProtection, isLoggedIn, catchAsync( users.deleteUser ) );

router.post('/authenticated', ( req, res ) => {

  res.send(JSON.stringify({ authenticated: req.isAuthenticated() }));

});

router.get('/logout', users.logout);

module.exports = router;