export const mergeProductData = ( product, data ) => {

  const { tiers } = data;
    
  product.ingredients = [];

  for ( const tier of tiers ) { for ( const selection of tier.selected ) { product.ingredients.push(`${ tier._id }.${ selection }`) } };

  product.quantity = data.quantity;
  product.comments = data.comments;

  delete product.category;
  delete product.tiers;

  return product;

};