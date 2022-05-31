import { db } from "./database.js";
import { generateID } from "./database.js";

export const updateCartProduct = async ( uuid, data ) => {

  const { comments, quantity, tiers, description } = data;

  const ingredients = [];

  for ( const tier of tiers ) { for ( const selection of tier.selected ) { ingredients.push(`${ tier._id }.${ selection }`) } };

  return db.cart.update(uuid, { quantity, comments, ingredients, description }).then(function (updated) {
    
    return { description, quantity, status: updated };

  });

};

export const getCartProductsTotalPrice = async (  ) => {

  const totalPrice = await db.table("cart").toArray()
      .then( result => {

        const values = result.map( p => p.quantity * p.price );

        let total = 0;

        for ( const value of values ) {

          total += value;

        }

        return total;

      });
    
  return totalPrice;

};

export const updateProductQuantity = async ( cartID, value ) => {

  return db.cart.update(cartID, {quantity: value}).then( async function (updated) {

    return updated;

  });

};

export const removeCartProduct = async uuid => {

  return db.transaction('rw', db.cart, function* () {
    
    const deleteCount = yield db.cart
        .where("uuid").equals( uuid )
        .delete();

    if ( deleteCount >= 1 ) return true;

    return false;

  }).catch (e => {
  
    console.error (e);

    return false;
  
  });

};

export const addCartProduct = async data => {

  const cartID = generateID();

  data.uuid = cartID;

  return db.transaction('rw', db.cart, function () {

    db.cart.add( data, cartID );

    return db.cart.get({ uuid: cartID }); 

  }).catch(function(err) {

    console.error(err.stack || err);

  });   

};

export const getCartProduct = async uuid => {

  return db.cart.get( uuid );

};

export const getCartProducts = async () => {

  return await db.table("cart").toArray().then(res => { return res; })

};