const express = require('express');
const { csrfProtection } = require('../app.js');
const router = express.Router();
const shop = require('../controllers/shop.js');

router.route('/')
  .get( csrfProtection, shop.renderShop);

module.exports = router;