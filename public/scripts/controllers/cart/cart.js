import * as shopModel from '../../models/shop.js';
import CartView from '../../views/cart/CartView.js';

import ProductPreferences from '../../views/products/ProductPreferences.js';

import * as orderController from '../order/order.js';

const controlRemoveCartProduct = async uuid => {

  await shopModel.removeCartProduct( uuid );

  const totalPrice = await shopModel.getCartProductsTotalPrice();

  CartView.removeCartProduct( uuid );

  CartView.updateTotalPrice( totalPrice.toFixed( 2 ) );

};

const controlQuantityChange = async ( uuid, quantity ) => {

  const updated = await shopModel.updateCartProductQuantity( uuid, quantity );

  const totalPrice = await shopModel.getCartProductsTotalPrice();

  CartView.updateTotalPrice( totalPrice.toFixed( 2 ) );

}

const controlUpdateCartProduct = uuid => {

  const data = ProductPreferences.getViewData('all');

  shopModel.updateCartProduct( uuid, data.tiers, data );

  const { tiers, quantity, description } = data;

  CartView.updateCartProduct( uuid, quantity, description );

  ProductPreferences.onSuccess("Product Updated Successfully");

};

const controlRenderEditCartProduct = async uuid => {

  const cartProduct = await shopModel.loadCartProduct( uuid );

  const { data: product, error } = await shopModel.loadProduct( cartProduct._id );

  if ( error ) return;

  const tiersIDS = product.tiers.map(t => t._id);

  for ( const ingredient of cartProduct.ingredients ) {

    for ( let tiersIndex = 0; tiersIndex < tiersIDS.length; tiersIndex += 1 ) {

      if ( tiersIDS[ tiersIndex ] === ingredient.split('.')[0] ) { 
        
        product.tiers[ tiersIndex ].selectedIngredients.push( ingredient.split('.')[1] ); 
        
        continue;

      }

    }

  }

  product.quantity = cartProduct.quantity;

  product.comments = cartProduct.comments;

  ProductPreferences.render({
    item:  product,
    actions: [ { name: 'update', exec: () => { controlUpdateCartProduct( uuid ); } } ],
    methods: {}
  })

};

export const controlRenderCart = async () => {

  const orderTotal = await shopModel.getCartProductsTotalPrice();

  CartView.render({
    items: shopModel.state.cartProducts,
    orderTotal,
    itemMethods: {
      onClick: uuid => { controlRenderEditCartProduct( uuid ); },
      remove: uuid => { controlRemoveCartProduct( uuid ); },
      quantityChange: ( uuid, quantity ) => { controlQuantityChange( uuid, quantity ) }
    },
    methods: {
      onOrder: () => { orderController.controlRenderOrderInfo(); }
    }
  });

};