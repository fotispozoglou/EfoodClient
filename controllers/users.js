"use strict";

const User = require('../models/user');
var jwt = require('jsonwebtoken');

const sanitizeHtml = require('sanitize-html');

const axios = require('axios');

const { GENERAL, ORDER } = require('../config/statusCodes.js');
const { API_URL } = require('../config/config');
const passport = require('passport');
const { PASSWORDS_NOT_MATCH, languages, WRONG_PASSWORD, REGISTERATION_DISABLED } = require('../config/strings');

const COOKIE_EXPIRE_SECONDS = 7 * ( 24 * 3600 );
const COOKIE_EXPIRE_MILLI = 7 * ( 24 * 3600 * 1000 );

const orderToken = jwt.sign({ code: process.env.CLIENT_SERVER_SECRET }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });

const generateAPIToken = async user => {

  return jwt.sign(
    { _id: user._id, username: user.username }, 
    process.env.TOKEN_SECRET, 
    { expiresIn: `${ COOKIE_EXPIRE_SECONDS }s` }
  );

};

module.exports.register = async ( req, res ) => {

  const languageNumber = req.user ? languages.get( req.user.preferences.language ) : 0;

  return res.send(JSON.stringify({ 
    status: GENERAL.ERROR, 
    registered: false,
    message: REGISTERATION_DISABLED[ languageNumber ]
  }));

  try {

    const { username, password } = req.body;

    const user = new User({ 
      username: sanitizeHtml( username ), 
      name: sanitizeHtml( username ),
      phone: '',
      address: '',
      floor: '',
      preferences: { 
        privacy: {
          privateName: true, 
          privatePhone: true 
        },
        language: 'EN'
      } 
    });

    const registeredUser = await User.register(user, password);

    req.login(registeredUser, async err => {
    
      if (err) return res.send(JSON.stringify({ status: GENERAL.ERROR, registered: false }));
  
      const token = await generateAPIToken({ username: registeredUser.username, _id: registeredUser._id });
  
      await User.updateOne({ _id: registeredUser._id }, { $set: { token } });

      res.send(JSON.stringify({ status: GENERAL.SUCCESS, registered: true }));
    
    });

  } catch ( error ) {

    res.send(JSON.stringify({ status: GENERAL.ERROR, registered: false, message: error.message }));

  }

}

module.exports.login = async (req, res, next) => {

  passport.authenticate('local', { failureRedirect: '/login/failed' }, function(err, user, info) {
    
    if ( err ) return res.send(JSON.stringify({ status: GENERAL.ERROR, authenticated: false }));

    if ( !user || ( info && info === "IncorrectPasswordError" ) ) {
      
      return next();

    }

    req.login(user, async function( err ) {

      if ( err ) return res.send(JSON.stringify({ status: GENERAL.ERROR, authenticated: false }));

      const token = await generateAPIToken({ username: req.user.username, _id: req.user._id });

      await User.updateOne({ _id: req.user._id }, { $set: { token } });
  
      res.send(JSON.stringify({ status: GENERAL.SUCCESS, authenticated: true }));

    });

  })(req, res);

}

module.exports.logout = ( req, res ) => {

  req.logout(function(err) {
    
    if (err) { return next(err); }
          
    res.redirect('/shop');

  });

}

module.exports.getUserInfo = async ( req, res ) => {

  const { username, name, phone, address, floor } = req.user;

  res.send(JSON.stringify({ 
    status: GENERAL.SUCCESS, 
    username: sanitizeHtml( username ), 
    name: sanitizeHtml( name ), 
    phone: sanitizeHtml( phone ),
    address: sanitizeHtml( address ), 
    floor: sanitizeHtml( floor )
  }));

};

module.exports.saveUserInfo = async ( req, res ) => {

  const { info } = req.body;

  const userID = req.user._id;

  const newUserInfo = { 
    name: sanitizeHtml( info.name ), 
    phone: sanitizeHtml( info.phone ), 
    username: sanitizeHtml( info.username ),
    address: sanitizeHtml( info.address ),
    floor: sanitizeHtml( info.floor )
  };

  // await User.updateOne({ _id: userID }, { $set: newUserInfo });

  res.send(JSON.stringify({ status: GENERAL.SUCCESS, info: newUserInfo }));

};

module.exports.getPrivacySettings = async ( req, res ) => {

  const user = await User.findById( req.user._id );

  res.send(JSON.stringify({ status: GENERAL.SUCCESS, preferences: user.preferences }));

};

module.exports.updateUserPassword = async ( req, res ) => {

  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  const foundUser = await User.findById( req.user._id );

  const languageNumber = req.user ? languages.get( req.user.preferences.language ) : 0;

  if ( newPassword !== newPasswordConfirm ) {

    return res.send(JSON.stringify({ status: GENERAL.ERROR, message: PASSWORDS_NOT_MATCH[ languageNumber ] }));

  }

  foundUser.authenticate( currentPassword, async function( error, model, passwordError ) {

    if ( passwordError || error ) {

      return res.send(JSON.stringify({ status: GENERAL.ERROR, message: WRONG_PASSWORD[ languageNumber ] }));

    }

    res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  });

  // await foundUser.changePassword( currentPassword, newPassword, function( err ) {

  //   if ( err ) return res.send(JSON.stringify({ status: GENERAL.ERROR }));

  //   res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

  // });

};

module.exports.updatePrivacySettings = async ( req, res ) => {

  const { preference } = req.body;

  const userID = req.user._id; 

  // if ( preference.name === "visible_name" ) {

  //   await User.updateOne({ _id: userID }, { 'preferences.privacy.privateName': preference.value })

  // } else if ( preference.name === "visible_phone" ) {

  //   await User.updateOne({ _id: userID }, { 'preferences.privacy.privatePhone': preference.value });

  // }

  res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

};

module.exports.deleteUser = async ( req, res ) => {

  const { password } = req.body;

  const user = await User.findById( req.user._id );

  user.authenticate( password, async function( error, model, passwordError ) {

    if ( passwordError || error ) {

      return res.send(JSON.stringify({ status: GENERAL.ERROR }));

    }

    return res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

    // const config = {
    //   headers: {
    //     'server-token': `Bearer ${orderToken}`
    //   }
    // };
  
    // await axios.post(`${ API_URL }/orders/removeClientInfo`, { userID: req.user._id }, config)
    //   .then(async response => {

    //     if ( response.data.hasPendingOrders ) {

    //       return res.send(JSON.stringify({ status: GENERAL.SUCCESS, deleteStatus: ORDER.HAS_PENDING_ORDER }));

    //     }

    //     await user.remove();
  
    //     req.logout(function(err) {
          
    //       if (err) {
      
    //         return res.send(JSON.stringify({ status: GENERAL.SUCCESS }));
      
    //       }
          
    //       res.clearCookie('api_token');
            
    //       res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

    //     });

    //   })
    //   .catch(e => {
    
    //     return res.send(JSON.stringify({ status: GENERAL.SUCCESS }));
    
    //   });

  });

};

module.exports.changeUserLanguage = async ( req, res ) => {

  const { language } = req.body;

  req.user.preferences.language = language;

  await User.updateOne({ _id: req.user._id }, { $set: { 'preferences.language': language } });

  res.send(JSON.stringify({ status: GENERAL.SUCCESS }));

};