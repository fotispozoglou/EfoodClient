const axios = require('axios');
const { GENERAL, ORDER } = require('../config/statusCodes.js');

const jwt = require('jsonwebtoken');

const orderToken = jwt.sign({ code: process.env.CLIENT_SERVER_SECRET }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });

module.exports.renderOrder = async ( req, res ) => {

  res.render('order/index');

};

module.exports.completeOrder = async ( req, res ) => {

  const user = req.user;

  if ( user === undefined || user === null ) {

    return res.send(JSON.stringify({ status: GENERAL.NOT_AUTHENTICATED }));

  }

  const authHeader = req.headers['authorization'];

  const { products, client } = req.body.order;

  const config = {
    headers: {
      'server-token': `Bearer ${orderToken}`,
      'authorization': authHeader
    }
  };

  await axios.post('http://127.0.0.1:3000/orders', { order: { products, client, user } }, config)
    .then(response => {

      if ( response.data.status === ORDER.HAS_PENDING_ORDER ) {

        return res.send({ status: ORDER.HAS_PENDING_ORDER });

      }

      return res.send(JSON.stringify({ status: response.data.status, orderID: response.data.orderID, order: response.data.order }));

    })
    .catch(e => {  

      console.log(e);

      return res.send(JSON.stringify({ status: -100 }));

    });

};