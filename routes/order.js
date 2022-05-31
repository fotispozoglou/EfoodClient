const express = require('express');
const router = express.Router();
const order = require('../controllers/order.js');

router.route('/')
  .get(order.renderOrder)
  .post(order.completeOrder);

module.exports = router;