const express = require('express');
const router = express.Router();
const shop = require('../controllers/shop.js');

router.route('/')
  .get(shop.renderShop);

module.exports = router;