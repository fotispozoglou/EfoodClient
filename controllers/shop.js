"use strict";

const { strings, languages } = require('../config/strings.js');

module.exports.renderShop = async ( req, res ) => {

  const allStrings = strings;

  const languageNumber = req.user ? languages.get( req.user.preferences.language ) : 0;

  res.render('shop/index', { 
    user: req.user, 
    csrfToken: req.csrfToken(),
    language: languageNumber,
    strings: allStrings
  });

};