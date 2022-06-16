module.exports.renderShop = async ( req, res ) => {

  const products = [
    { name: 'Πίτα γύρο' },
    { name: 'Πίτα κοτόπουλο' },
    { name: 'Σαλάτα με λαχανικά' },
    { name: 'Sprite με ανθρακικό' }
  ];

  res.render('shop/index', { user: req.user, products });

};