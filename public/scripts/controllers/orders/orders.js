import OrdersView from "../../views/orders/OrdersView.js";
import OrderView from "../../views/orders/OrderView.js";

import * as ordersModel from '../../models/orders.js';
import * as orderModel from '../../models/order.js';  
import { GENERAL, ORDER } from "../../config/statusCodes.js";

import { controlRenderLogin } from '../authentication/authentication.js';
import statusColors from "../../config/colors.js";

import ViewManager, { openOrdersBtn, ordersErrorIcon } from "../../views/ViewManager.js";
import { controlRenderMessage } from "../../general/messages.js";
import { MESSAGE } from "../../config/types.js";
import { ERROR_LOADING_ORDERS } from "../../config/strings.js";

let hasOrderStatusError = false;

const controlShowStatusError = async orderID => {

  ordersErrorIcon.classList.remove('hidden');

  OrdersView.showOrderStatusError( orderID );

  if ( OrderView.isRendered() && OrderView.getOrderID() === orderID ) {

    OrderView.showStatusError();

  }

};

const controlHideStatusError = async orderID => {

  ordersErrorIcon.classList.add('hidden');

  OrdersView.hideOrderStatusError( orderID );

  if ( OrderView.isRendered() && OrderView.getOrderID() === orderID ) {

    OrderView.hideStatusError();

  }

};

const controlOrderStatusChange = async ( response, orderID ) => {

  const { status, error } = response;

  if ( status.number === ORDER.NOT_FOUND ) {

    return orderModel.stopCheckOrderTimeout();

  }

  if ( error ) {
   
    hasOrderStatusError = true;
    
    return controlShowStatusError( orderID );

  }

  if ( hasOrderStatusError ) {

    controlHideStatusError( orderID );

    hasOrderStatusError = false;

  }

  OrderView.updateStatus( status );

  OrdersView.updateOrder( orderID, status );

  if ( status.number != ORDER.STATUS_COMPLETED && status.number != ORDER.STATUS_CANCELED ) { 

    const { backgroundColor } = statusColors.get( status.number );

    openOrdersBtn.style.color = backgroundColor;

  } else {

    let { backgroundColor } = statusColors.get( status.number );

    if ( ViewManager.selectedViewID === OrdersView.getViewID() ) {

      backgroundColor = statusColors.get( ORDER.NOTHING ).backgroundColor;

    }

    openOrdersBtn.style.color = backgroundColor;
  

  }

  if ( status.number === ORDER.STATUS_COMPLETED || status.number === ORDER.STATUS_CANCELED ) {

    orderModel.stopCheckOrderTimeout();

  }

};

const controlStartCheckingOrderStatus = async orderID => {

  orderModel.startCheckOrder( orderID, status => { controlOrderStatusChange( status, orderID ); } );

};

const controlRemoveOrder = async orderID => {

  await ordersModel.removeOrder( orderID );

  OrdersView.removeOrder( orderID );

  OrderView.remove();

};

const controlRenderOrder = async orderID => {

  const { data, error } = await ordersModel.loadOrder( orderID );

  if ( error ) return controlRenderMessage( ERROR_LOADING_ORDER , MESSAGE.MESSAGE_ERROR);

  const { order } = data;

  if ( order.status === GENERAL.ERROR ) return;

  OrderView.render({
    order,
    stopCheckingStatus: orderModel.stopCheckOrderTimeout,
    removeOrder: controlRemoveOrder
  }); 

  OrdersView.updateOrder( orderID, order.status );

  if ( order.status.number != ORDER.STATUS_COMPLETED && order.status.number != ORDER.STATUS_CANCELED ) { 

    const { backgroundColor } = statusColors.get( order.status.number );

    openOrdersBtn.style.color = backgroundColor;

  }

  if ( order.status.number !== ORDER.STATUS_COMPLETED && order.status.number !== ORDER.STATUS_CANCELED ) {

    controlStartCheckingOrderStatus( order._id );

  }

};

export const renderOrder = order => {

  OrdersView.addOrder( order );

};

export const controlRenderOrders = async () => {

  const { data, error } = await ordersModel.loadOrders();

  if ( error ) { 

    return controlRenderMessage( ERROR_LOADING_ORDERS , MESSAGE.MESSAGE_ERROR);

  }

  const { orders } = data;

  if ( orders.status === GENERAL.ERROR ) {

    return controlRenderLogin();

  }

  ViewManager.render( OrdersView, controlRenderOrders, {
    orders,
    onClick: controlRenderOrder,
    renderPrevious: () => { ViewManager.renderPrevious(); }
  }, true);

};

export const checkUserHasActiveOrder = async () => {

  const { data, error } = await ordersModel.checkUserHasActiveOrder();

  if ( error ) return;

  if ( data.hasPendingOrders ) {

    const { backgroundColor } = statusColors.get( data.orderStatus.number );

    openOrdersBtn.style.color = backgroundColor;

    controlStartCheckingOrderStatus( data.orderID );

  }

};