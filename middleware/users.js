const { GENERAL } = require("../config/statusCodes");

const isLoggedIn = async ( req, res, next ) => {

  if ( !req.isAuthenticated() ) return res.send(JSON.stringify({ status: GENERAL.SUCCESS, orderStatus: GENERAL.NOT_AUTHENTICATED }));

  next();

};

const validatePreference = async ( req, res, next ) => {

  const { preference } = req.body;

  if ( preference.name !== "visible_name" && preference.name !== "visible_phone" ) {

    return res.status( 404 ).send();

  }

  if ( preference.value !== false && preference.value !== true ) {

    return res.status( 404 ).send();

  }

  next();

};

module.exports = {
  isLoggedIn,
  validatePreference
};