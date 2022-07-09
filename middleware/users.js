const isLoggedIn = async ( req, res, next ) => {

  if ( !req.isAuthenticated() ) return res.status( 403 ).send();

  next();

};

module.exports = {
  isLoggedIn
};