"use strict";

const axios = require('axios');
const { GENERAL, ORDER } = require('../config/statusCodes.js');
const { API_URL } = require('../config/config.js');

const jwt = require('jsonwebtoken');

const orderToken = jwt.sign({ code: process.env.CLIENT_SERVER_SECRET }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });

module.exports.completeOrder = async ( req, res ) => {

  const user = req.user;

  if ( user === undefined || user === null ) {

    return res.send(JSON.stringify({ status: GENERAL.SUCCESS, orderStatus: GENERAL.NOT_AUTHENTICATED }));

  }

  return res.send({ status: GENERAL.SUCCESS, orderStatus: ORDER.HAS_PENDING_ORDER });

  // if ( user.preferences.privateName ) user.name = 'private';

  // if ( user.preferences.privatePhone ) user.phone = 'private';

  // const authHeader = req.headers['authorization'];

  // const { products, client } = req.body.order;

  // const config = {
  //   headers: {
  //     'server-token': `Bearer ${ orderToken }`,
  //     'authorization': authHeader
  //   }
  // };

  // await axios.post(`${ API_URL }/orders`, { order: { products, client, user } }, config)
  //   .then(response => {

  //     if ( response.data.status === ORDER.HAS_PENDING_ORDER ) {

  //       return res.send({ status: GENERAL.SUCCESS, orderStatus: ORDER.HAS_PENDING_ORDER });

  //     }

  //     if ( response.data.status === GENERAL.ERROR ) {

  //       return res.send({ status: GENERAL.SUCCESS, orderStatus: GENERAL.ERROR, invalidFields: response.data.invalidFields });

  //     }

  //     return res.send(JSON.stringify({ 
  //       status: GENERAL.SUCCESS, 
  //       orderStatus: response.data.status, 
  //       orderID: response.data.orderID, 
  //       order: response.data.order 
  //     }));

  //   })
  //   .catch(e => {  

  //     return res.send(JSON.stringify({ status: GENERAL.ERROR }));

  //   });

};