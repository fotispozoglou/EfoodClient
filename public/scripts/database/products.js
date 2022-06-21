import { db } from "./database.js";
import { generateID } from "./database.js";

export const updateCartProduct = async ( uuid, data ) => {

  const { comments, quantity, tiers, description } = data;

  const ingredients = [];

  for ( const tier of tiers ) { for ( const selection of tier.selected ) { ingredients.push(`${ tier._id }.${ selection }`) } };

  return db.cart.update(uuid, { quantity, comments, ingredients, description }).then(function (updated) {

    return { data: { description, quantity, status: updated } };

  })
  .catch( error => {

    return { error };

  });

};

export const getCartProductsTotalPrice = async (  ) => {

  return await db.table("cart").toArray()
    .then( result => {

      const values = result.map( p => p.quantity * p.price );

      let total = 0;

      for ( const value of values ) {

        total += value;

      }

      return { data: { total } };

    })
    .catch( error => {

      return { error };
  
    });

};

export const updateProductQuantity = async ( cartID, value ) => {

  return db.cart.update(cartID, {quantity: value}).then( async function (updated) {

    return { data: { updated } };

  })
  .catch( error => {

    return { error };

  });

};

export const removeCartProduct = async uuid => {

  return db.transaction('rw', db.cart, function* () {
    
    const deleteCount = yield db.cart
        .where("uuid").equals( uuid )
        .delete();

    if ( deleteCount >= 1 ) return { data: { removed: true } };

    throw new Error("Can't remove product");

  }).catch (error => {
  
    return { error };
  
  });

};

export const addCartProduct = async data => {

  const cartID = generateID();

  data.uuid = cartID;

  return db.transaction('rw', db.cart, async function () {

    db.cart.add( data, cartID );

    const added = await db.cart.get({ uuid: cartID });

    return { data: { added } };

  }).catch(function(error) {

    return { error };

  });   

};

export const getCartProduct = async uuid => {

  return db.cart.get( uuid );

};

export const getCartProducts = async () => {

  return await db.table("cart").toArray()
    .then(products => { return { data: { products } }; })
    .catch(error => { return { error } });

};

export const emptyCart = async () => {

  return await db.table("cart").clear();

};