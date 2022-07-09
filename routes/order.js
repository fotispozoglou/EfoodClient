const express = require('express');
const { csrfProtection } = require('../app.js');
const router = express.Router();
const order = require('../controllers/order.js');
const { isLoggedIn } = require('../middleware/users.js');

router.route('/')
  .get( order.renderOrder )
  .post( csrfProtection, isLoggedIn, order.completeOrder);

module.exports = router;