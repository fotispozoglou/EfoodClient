module.exports.renderShop = async ( req, res ) => {

  res.render('shop/index', { user: req.user });

};