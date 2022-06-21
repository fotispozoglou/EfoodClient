import OrdersView from "../../views/orders/OrdersView.js";
import OrderView from "../../views/orders/OrderView.js";

import * as ordersModel from '../../models/orders.js';
import * as orderModel from '../../models/order.js';  
import { stopCheckOrderInterval } from '../../models/order.js';
import { GENERAL, ORDER } from "../../config/statusCodes.js";

import { controlRenderLogin } from '../authentication/authentication.js';
import statusColors from "../../config/colors.js";

import ViewManager, { openOrdersBtn, ordersErrorIcon } from "../../views/ViewManager.js";
import { controlRenderMessage } from "../shop.js";
import { MESSAGE } from "../../config/types.js";

let hasOrderNotification = false;
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

  if ( status != ORDER.STATUS_COMPLETED && status != ORDER.STATUS_CANCELED ) { 

    const { backgroundColor } = statusColors.get( status.number );

    openOrdersBtn.style.color = backgroundColor;

  } else {

    let { backgroundColor } = statusColors.get( status.number );

    hasOrderNotification = true;

    if ( ViewManager.selectedViewID === OrdersView.getViewID() ) {

      backgroundColor = statusColors.get( ORDER.NOTHING ).backgroundColor;

      hasOrderNotification = false;

    }

    openOrdersBtn.style.color = backgroundColor;
  

  }

  if ( status === ORDER.STATUS_COMPLETED || status === ORDER.STATUS_CANCELED ) {

    orderModel.stopCheckOrderInterval();

  }

};

const controlStartCheckingOrderStatus = async orderID => {

  orderModel.startCheckOrderInterval( orderID, status => { controlOrderStatusChange( status, orderID ); } );

};

const controlRemoveOrder = async orderID => {

  await ordersModel.removeOrder( orderID );

  OrdersView.removeOrder( orderID );

  OrderView.remove();

};

const controlRenderOrder = async orderID => {

  const { data, error } = await ordersModel.loadOrder( orderID );

  if ( error ) return controlRenderMessage("error loading order", MESSAGE.MESSAGE_ERROR);

  const { order } = data;

  if ( order.status === GENERAL.ERROR ) return;

  OrderView.render({
    order,
    stopCheckingStatus: stopCheckOrderInterval,
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
   
    OrdersView.render({
      orders: [],
      onClick: controlRenderOrder
    }); 

    return controlRenderMessage("error loading orders", MESSAGE.MESSAGE_ERROR);

  }

  const { orders } = data;

  if ( orders.status === GENERAL.ERROR ) {

    return controlRenderLogin();

  }

  OrdersView.render({
    orders,
    onClick: controlRenderOrder
  });  

  if ( hasOrderNotification ) {

    const {backgroundColor} = statusColors.get( ORDER.NOTHING );

    openOrdersBtn.style.color = backgroundColor;

    hasOrderNotification = false;

  }

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