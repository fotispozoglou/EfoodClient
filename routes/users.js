const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync.js');
const users = require('../controllers/users.js');

router.post('/generate/token', users.getAPIToken);

router.route('/register')
  .post(catchAsync(users.register));

router.route('/login')
  .post(passport.authenticate('local', { failureFlash: false, failureRedirect: '/shop' }), users.login);

router.route('/info')
  .get( catchAsync( users.getUserInfo ) )
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