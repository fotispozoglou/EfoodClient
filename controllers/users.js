const User = require('../models/user');
var jwt = require('jsonwebtoken');

const COOKIE_EXPIRE_SECONDS = 22 * ( 24 * 3600 );
const COOKIE_EXPIRE_MILLI = 22 * ( 24 * 3600 * 1000 );

const generateAPIToken = async user => {

  return jwt.sign(
    { _id: user._id, username: user.username }, 
    process.env.TOKEN_SECRET, 
    { expiresIn: `${ COOKIE_EXPIRE_SECONDS }s` }
  );

};

module.exports.register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, async err => {
    
        if (err) return next(err);
    
        const token = await generateAPIToken({ username: registeredUser.username, _id: registeredUser._id });
    
        res.cookie('api_token', token, { expires: new Date( Date.now() + COOKIE_EXPIRE_MILLI ) });

        res.redirect('/shop');
    
    })
  } catch (e) {
    res.redirect('shop');
  }
}

module.exports.login = async (req, res) => {
    const redirectUrl = req.session.returnTo || '/shop';
    delete req.session.returnTo;

    const token = await generateAPIToken({ username: req.user.username, _id: req.user._id });
    
    res.cookie('api_token', token, { expires: new Date( Date.now() + COOKIE_EXPIRE_MILLI  ) });

    res.redirect(redirectUrl);
}

module.exports.getAPIToken = async ( req, res ) => {

  const { user } = req;

  if ( !user ) return res.sendStatus( 401 );

  const token = await generateAPIToken( { username: user.username, _id: user._id } );

  res.cookie('api_token', token, { expires: new Date( Date.now() + COOKIE_EXPIRE_MILLI ) });

  res.send(JSON.stringify({ w: true }));

};

module.exports.getUserInformation = async ( req, res ) => {

  const { clientID } = req.body;

  const user = await User.findById( clientID );

  res.send(JSON.stringify({ user }));

};

module.exports.logout = (req, res) => {

  req.logout(function(err) {
    
    if (err) { return next(err); }
    
    res.clearCookie('api_token');
      
    res.redirect('/shop');

  });

}