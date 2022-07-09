const { GENERAL } = require("../config/statusCodes");

const isLoggedIn = async ( req, res, next ) => {

  if ( !req.isAuthenticated() ) return res.send(JSON.stringify({ status: GENERAL.SUCCESS, orderStatus: GENERAL.NOT_AUTHENTICATED }));

  next();

};

module.exports = {
  isLoggedIn
};