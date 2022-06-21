import { SERVER_URL, API_SERVER_URL } from '../config/config.js';
import { GENERAL, ORDER } from '../config/statusCodes.js';
import { DELETE, GET } from '../general/request.js';

export const state = {

};

export const removeOrder = async orderID => {

  const { data, error } = await DELETE(`${ API_SERVER_URL }/orders/${ orderID }`);

  if ( !error ) {

    return;

  }

  return { error };

};

export const loadOrders = async () => {

  return await GET(`${ API_SERVER_URL }/orders/all`);

};

export const loadOrder = async orderID => {

  const { data, error } = await GET(`${ API_SERVER_URL }/orders/${ orderID }`);

  if ( !error ) {

    const { order } = data;

    for ( let productsIndex = 0; productsIndex < order.products.length; productsIndex += 1 ) {

      const quantity = order.products[ productsIndex ].quantity;

      const original = { ...order.products[ productsIndex ].original };

      order.products[ productsIndex ] = original;

      order.products[ productsIndex ].quantity = quantity;

    }

    return { data: { order, status: GENERAL.SUCCESS } };

  }

  return { error };

};

export const checkUserHasActiveOrder = async () => {

  const { data, error } = await GET(`${ API_SERVER_URL }/orders/user/active`);

  if ( !error ) {

    return { data };

  }

  return { error };

};