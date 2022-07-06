const authenticateUser = async ( req, res, next ) => {

  if ( !req.user ) return res.status( 403 ).send();

  next();

};

module.exports = {
  authenticateUser
};