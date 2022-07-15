import { ERROR_CALCULATING_TOTAL, ERROR_LOADING_CART, ERROR_REMOVING_PRODUCT, ERROR_UPDATING_PRODUCT, ERROR_UPDATING_QUANTITY, ORDER_TOTAL_NOT_ACCURATE, UPDATE } from '../../config/strings.js';
import { MESSAGE } from '../../config/types.js';
import * as shopModel from '../../models/shop.js';
import CartView from '../../views/cart/CartView.js';
import { LONG } from '../../views/general/Notification.js';

import ProductPreferences from '../../views/products/ProductPreferences.js';
import ViewManager from '../../views/ViewManager.js';

import * as orderController from '../order/order.js';
import { controlRenderMessage } from '../../general/messages.js';

const controlRemoveCartProduct = async uuid => {

  const { data: removeData, error: removeError } = await shopModel.removeCartProduct( uuid );

  if ( removeError ) return controlRenderMessage( ERROR_REMOVING_PRODUCT , MESSAGE.MESSAGE_ERROR, LONG);

  const { data: { total }, error } = await shopModel.getCartProductsTotalPrice();

  if ( error ) return controlRenderMessage( ERROR_CALCULATING_TOTAL , MESSAGE.MESSAGE_ERROR, LONG);

  CartView.removeCartProduct( uuid );

  CartView.updateTotalPrice( total.toFixed( 2 ) );

};

const controlQuantityChange = async ( uuid, quantity ) => {

  const { data, error } = await shopModel.updateCartProductQuantity( uuid, quantity );

  if ( error ) { 
    
    controlRenderMessage( ERROR_UPDATING_QUANTITY , MESSAGE.MESSAGE_ERROR, LONG);

    return false;

  }

  const { data: totalPriceData, error: totalPriceError } = await shopModel.getCartProductsTotalPrice();

  if ( totalPriceError ) controlRenderMessage( ORDER_TOTAL_NOT_ACCURATE , MESSAGE.MESSAGE_ERROR, LONG);

  if ( !totalPriceError ) CartView.updateTotalPrice( totalPriceData.total.toFixed( 2 ) );

  return true;

}

const controlUpdateCartProduct = async uuid => {

  const productData = ProductPreferences.getViewData('all');

  const { data, error } = await shopModel.updateCartProduct( uuid, productData.tiers, productData );

  if ( error ) return controlRenderMessage( ERROR_UPDATING_PRODUCT , MESSAGE.MESSAGE_ERROR, LONG);

  const { tiers, quantity, description } = productData;

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
    actions: [ { name: UPDATE, exec: () => { controlUpdateCartProduct( uuid ); } } ],
    methods: {}
  })

};

export const controlRenderCart = async () => {

  const { data, error } = await shopModel.getCartProductsTotalPrice();

  if ( error ) {

    shopModel.clearCart();  
    
    return controlRenderMessage( ERROR_LOADING_CART , MESSAGE.MESSAGE_ERROR, LONG);

  }

  if ( !CartView._rerender ) {

    CartView.render({
      items: shopModel.state.cartProducts,
      orderTotal: data.total,
      itemMethods: {
        onClick: uuid => { controlRenderEditCartProduct( uuid ); },
        remove: uuid => { controlRemoveCartProduct( uuid ); },
        quantityChange: ( uuid, quantity ) => { return controlQuantityChange( uuid, quantity ) }
      },
      methods: {
        onOrder: () => { orderController.controlRenderOrderInfo(); }
      }
    });

  }

};