"use strict";

const escapeHTML = require('escape-html');

module.exports.renderShop = async ( req, res ) => {

  const products = [
    { name: 'Πίτdα γύρο<script>alert(1);</script>' },
    { name: 'Πίτα κοτόπουλο' },
    { name: 'Σαλάτα με λαχανικά' },
    { name: 'Sprite με ανθρακικό' }
  ];

  res.render('shop/index', { user: req.user, products: products, csrfToken: req.csrfToken() });

};