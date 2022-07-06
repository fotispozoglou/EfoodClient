const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync.js');
const users = require('../controllers/users.js');
const { authenticateUser } = require('../middleware/users.js');
const { loginLimiter, registerLimiter } = require('../middleware/limiters.js');

router.post('/generate/token', users.getAPIToken);

router.route('/register')
  .post(
    registerLimiter,
    catchAsync(users.register)
  );

router.route('/login')
  .post( 
    // loginLimiter,
    catchAsync( users.login )
  );

router.route('/info')
  .get( authenticateUser, catchAsync( users.getUserInfo ) )
  .put( catchAsync( users.saveUserInfo ) );

router.route('/preferences')
  .get( catchAsync( users.getPrivacySettings ) )
  .put( catchAsync( users.updatePrivacySettings ) );

router.route('/password')
  .put( catchAsync( users.updateUserPassword ) );

router.route('/deleteUser')
  .post( catchAsync( users.deleteUser ) );

router.post('/admin/information', users.getUserInformation);

router.get('/logout', users.logout)

module.exports = router;