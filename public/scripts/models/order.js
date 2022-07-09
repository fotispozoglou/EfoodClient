import * as productsDB from '../database/products.js';
import { SERVER_URL, API_SERVER_URL } from '../config/config.js';

import { GET, POST } from '../general/request.js';
import { ORDER, GENERAL } from '../config/statusCodes.js';
import { ordersInterval } from '../config/values.js';

export const state = {
  cartProducts: [],
  trackingOrder: false,
  trackingOrderID: "",
  trackingOrderStatus: null,
  responseCallback: () => {}
};

let checkOrderTimeout;
let checkOrderTime = 10000;

export const stopCheckOrderTimeout = async () => {

  state.trackingOrder = false;

  clearTimeout( checkOrderTimeout );

};

const startCheckOrderTimeout = () => {

  const t1 = Date.now();

  checkOrderTimeout = setTimeout( async () => { 
    
    await checkOrderStatus( state.trackingOrderID, state.responseCallback );

    console.log(`SECONDS PASSED ${ (Date.now() - t1) / 1000 }`);
    
    startCheckOrderTimeout();
  
  }, checkOrderTime );

};

const setTimeoutTime = time => {

  if ( !time ) time = 10000;

  console.log("UPDATING TO " + time * 1000);

  checkOrderTime = time * 1000;

};

export const startCheckOrder = async ( orderID, responseCallback ) => {

  if ( state.trackingOrder ) return;

  state.trackingOrder = true;

  state.trackingOrderID = orderID;

  state.responseCallback = responseCallback;

  startCheckOrderTimeout();

};

const checkOrderStatus = async ( orderID, responseCallback ) => {

  const { data, error } = await GET(`${ API_SERVER_URL }/orders/${ orderID }/status`);

  if ( !error ) {

    const nonCompletedState = ORDER.NON_COMPLETED.includes( data.orderStatus.number );

    if ( ( data.orderStatus.number !== state.trackingOrderStatus ) && nonCompletedState ) {

      setTimeoutTime( ordersInterval.get( data.orderStatus.number ) );

      state.trackingOrderStatus = data.orderStatus;

    }

    return responseCallback({ status: data.orderStatus });

  }

  stopCheckOrderTimeout();

  return responseCallback({ error });

};

export const completeOrder = async client => {

  const order = { products: state.cartProducts, client };

  const { data, error } = await POST(`${ SERVER_URL }/order`, { order });

  if ( !error && data.status === GENERAL.SUCCESS ) {
    
    if ( data.orderStatus === ORDER.HAS_PENDING_ORDER || data.orderStatus === ORDER.STATUS_CANCELED || data.orderStatus === GENERAL.NOT_AUTHENTICATED ) {

      return { orderStatus: data.orderStatus, status: data.status };

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

  return data && data.status === GENERAL.ERROR ? { error: new Error("ERROR") } : { error };

};

export const loadCartProducts = async () => {

  const { data, error } = await productsDB.getCartProducts();

  if ( error ) return { error };

  state.cartProducts = data.products;

  return { loaded: true };

};

