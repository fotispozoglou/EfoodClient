const User = require('../models/user');
var jwt = require('jsonwebtoken');

const axios = require('axios');

const { GENERAL, ORDER } = require('../config/statusCodes.js');
const { API_URL } = require('../config/config');
const passport = require('passport');

const COOKIE_EXPIRE_SECONDS = 22 * ( 24 * 3600 );
const COOKIE_EXPIRE_MILLI = 22 * ( 24 * 3600 * 1000 );

const orderToken = jwt.sign({ code: process.env.CLIENT_SERVER_SECRET }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });

const generateAPIToken = async user => {

  return jwt.sign(
    { _id: user._id, username: user.username }, 
    process.env.TOKEN_SECRET, 
    { expiresIn: `${ COOKIE_EXPIRE_SECONDS }s` }
  );

};

module.exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = new User({ 
      username, 
      name: '',
      phone: '',
      preferences: { 
        privateName: true, 
        privatePhone: true 
      } 
    });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, async err => {
    
        if (err) return next(err);
    
        const token = await generateAPIToken({ username: registeredUser.username, _id: registeredUser._id });
    
        res.cookie('api_token', token, { expires: new Date( Date.now() + COOKIE_EXPIRE_MILLI ) });

        res.redirect('/shop');
    
    })
  } catch (e) {
    res.redirect('shop');
  }
}

module.exports.login = async (req, res) => {

  passport.authenticate('local', function(err, user, info) {
    
    if ( err ) return res.send(JSON.stringify({ status: GENERAL.ERROR, authenticated: 'false1' }));

    if ( !user ) return res.send(JSON.stringify({ status: GENERAL.SUCCESS, authenticated: 'false2' }));

    req.login(user, async function( err ) {

      if ( err ) return res.send(JSON.stringify({ status: GENERAL.ERROR, authenticated: 'false3' }));

      const token = await generateAPIToken({ username: req.user.username, _id: req.user._id });
  
      res.cookie('api_token', token, { expires: new Date( Date.now() + COOKIE_EXPIRE_MILLI  ) });

      res.send(JSON.stringify({ status: GENERAL.SUCCESS, authenticated: true }));

    });

  })(req, res);

}

module.exports.getAPIToken = async ( req, res ) => {

  const { user } = req;

  if ( !user ) return res.sendStatus( 401 );

  const token = await generateAPIToken( { username: user.username, _id: user._id } );

  res.cookie('api_token', token, { expires: new Date( Date.now() + COOKIE_EXPIRE_MILLI ) });

  res.send(JSON.stringify({ w: true }));

};

module.exports.getUserInformation = async ( req, res ) => {

  const { clientID } = req.body;

  const user = await User.findById( clientID );

  res.send(JSON.stringify({ user }));

};

module.exports.logout = ( req, res ) => {

  req.logout(function(err) {
    
    if (err) { return next(err); }
    
    res.clearCookie('api_token');
      
    res.redirect('/shop');

  });

}

module.exports.getUserInfo = async ( req, res ) => {

  const { username, name, phone } = req.user;

  res.send(JSON.stringify({ status: GENERAL.SUCCESS, username, name, phone }));

};

module.exports.saveUserInfo = async ( req, res ) => {

  const { info } = req.body;

  const userID = req.user._id;

  await User.updateOne({ _id: userID }, { $set: { name: info.name, phone: info.phone, username: info.username } })

  res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

};

module.exports.getPrivacySettings = async ( req, res ) => {

  const user = await User.findById( req.user._id );

  res.send(JSON.stringify({ status: GENERAL.SUCCESS, preferences: user.preferences }));

};

module.exports.updateUserPassword = async ( req, res ) => {

  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  const foundUser = await User.findById( req.user._id );

  await foundUser.changePassword( currentPassword, newPassword, function( err ) {

    if ( err ) return res.send(JSON.stringify({ status: GENERAL.ERROR }));

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  });

};

module.exports.updatePrivacySettings = async ( req, res ) => {

  const { preference } = req.body;

  const userID = req.user._id; 

  if ( preference.name === "visible_name" ) {

    await User.updateOne({ _id: userID }, { 'preferences.privateName': preference.value })

  } else if ( preference.name === "visible_phone" ) {

    await User.updateOne({ _id: userID }, { 'preferences.privatePhone': preference.value });

  }

  res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

};

module.exports.deleteUser = async ( req, res ) => {

  const { password } = req.body;

  const user = await User.findById( req.user._id );

  user.authenticate( password, async function( error, model, passwordError ) {

    if ( passwordError || error ) {

      return res.send(JSON.stringify({ status: GENERAL.ERROR }));

    }

    const config = {
      headers: {
        'server-token': `Bearer ${orderToken}`
      }
    };
  
    await axios.post(`${ API_URL }/orders/removeClientInfo`, { userID: req.user._id }, config)
      .then(async response => {

        if ( response.data.hasPendingOrders ) {

          return res.send(JSON.stringify({ status: GENERAL.SUCCESS, deleteStatus: ORDER.HAS_PENDING_ORDER }));

        }

        await user.remove();
  
        req.logout(function(err) {
          
          if (err) {
      
            return res.send(JSON.stringify({ status: GENERAL.SUCCESS }));
      
          }
          
          res.clearCookie('api_token');
            
          res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

        });

      })
      .catch(e => {
    
        return res.send(JSON.stringify({ status: GENERAL.SUCCESS }));
    
      });

  });

};