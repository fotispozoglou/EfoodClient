const express = require('express');
const router = express.Router();

router.get('/', ( req, res ) => {

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

  res.render('index', { products, categories });

});

module.exports = router;