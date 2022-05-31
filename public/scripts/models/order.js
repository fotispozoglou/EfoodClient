import * as productsDB from '../database/products.js';
import { SERVER_URL, API_SERVER_URL } from '../config/config.js';

import { GET, POST } from '../general/request.js';
import { ORDER } from '../config/statusCodes.js';

export const state = {
  cartProducts: [],
  trackingOrder: false,
  trackingOrderID: ""
};

let checkOrderInterval;

const checkOrderStatus = async ( orderID, responseCallback ) => {

  const { data, error } = await GET(`${ API_SERVER_URL }/orders/${ orderID }/status`);

  if ( !error ) {

    return responseCallback( data.orderStatus );

  }

  stopCheckOrderInterval();

  return { error };

};

export const stopCheckOrderInterval = async () => {

  state.trackingOrder = false;

  state.trackingOrderID = "";

  clearInterval( checkOrderInterval );

};

export const startCheckOrderInterval = async ( orderID, responseCallback ) => {

  state.trackingOrder = true;

  state.trackingOrderID = orderID;

  checkOrderInterval = setInterval( async () => { checkOrderStatus( orderID, responseCallback ) }, 10000 );

};

export const completeOrder = async client => {

  const order = { products: state.cartProducts, client };

  const { data, error } = await POST(`${ SERVER_URL }/order`, { order });

  if ( !error ) {

    if ( data.status === ORDER.HAS_PENDING_ORDER || data.status === ORDER.STATUS_CANCELED ) {

      return { status: data.status };

    }

    const { status, orderID, order } = data;

    for ( let productsIndex = 0; productsIndex < order.products.length; productsIndex += 1 ) {

      const quantity = order.products[ productsIndex ].quantity;

      const original = { ...order.products[ productsIndex ].original };

      order.products[ productsIndex ] = original;

      order.products[ productsIndex ].quantity = quantity;

    }

    return { status, orderID, order };

  }

  return { error };

};

export const loadCartProducts = async () => {

  state.cartProducts = await productsDB.getCartProducts();

};

