const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync.js');
const users = require('../controllers/users.js');
const { isLoggedIn } = require('../middleware/users.js');
const { loginLimiter, registerLimiter } = require('../middleware/limiters.js');
const { csrfProtection } = require('../app.js');

router.post('/generate/token', users.getAPIToken);

router.route('/register')
  .post(
    // registerLimiter,
    catchAsync( users.register )
  );

router.route('/login')
  .post( 
    // loginLimiter,
    catchAsync( users.login )
  );

router.route('/info')
  .get( csrfProtection, isLoggedIn, catchAsync( users.getUserInfo ) )
  .put( csrfProtection, isLoggedIn, catchAsync( users.saveUserInfo ) );

router.route('/preferences')
  .get( isLoggedIn, catchAsync( users.getPrivacySettings ) )
  .put( csrfProtection, isLoggedIn, catchAsync( users.updatePrivacySettings ) );

router.route('/password')
  .put( csrfProtection, isLoggedIn, catchAsync( users.updateUserPassword ) );

router.route('/deleteUser')
  .post( csrfProtection, isLoggedIn, catchAsync( users.deleteUser ) );

router.post('/admin/information', csrfProtection, users.getUserInformation);

router.get('/logout', users.logout);

module.exports = router;