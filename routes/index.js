const express = require('express');
const router = express.Router();

const { strings, languages } = require('../config/strings.js');

router.get('/', ( req, res ) => {

  const allStrings = strings;

  const languageNumber = req.user ? languages.get( req.user.preferences.language ) : 0;

  const products = [
    { name: 'Πίτα γύρο' },
    { name: 'Πίτα κοτόπουλο' },
    { name: 'Σαλάτα με λαχανικά' },
    { name: 'Sprite με ανθρακικό' }
  ];

  const categories = [
    { name: 'Τυλιχτά' },
    { name: 'Σαλάτες' },
    { name: 'Αναψυκτικά' },
    { name: 'Sus' }
  ];

  res.render('index', { 
    products, 
    categories,
    language: languageNumber,
    strings: allStrings
  });

});

module.exports = router;