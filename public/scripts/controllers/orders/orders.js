import OrdersView from "../../views/orders/OrdersView.js";
import OrderView from "../../views/orders/OrderView.js";

import * as ordersModel from '../../models/orders.js';
import * as orderModel from '../../models/order.js';  
import { stopCheckOrderInterval } from '../../models/order.js';
import { GENERAL, ORDER } from "../../config/statusCodes.js";

import { controlRenderLogin } from '../authentication/authentication.js';
import statusColors from "../../config/colors.js";

import ViewManager, { openOrdersBtn } from "../../views/ViewManager.js";

let hasOrderNotification = false;

const controlOrderStatusChange = async ( status, orderID ) => {

  OrderView.updateStatus( status );

  OrdersView.updateOrder( orderID, status );

  if ( status != ORDER.STATUS_COMPLETED && status != ORDER.STATUS_CANCELED ) { 

    const { backgroundColor } = statusColors.get( status );

    openOrdersBtn.children[0].style.color = backgroundColor;

  } else {

    let { backgroundColor } = statusColors.get( status );

    hasOrderNotification = true;

    if ( ViewManager.selectedViewID === OrdersView.getViewID() ) {

      backgroundColor = statusColors.get( ORDER.NOTHING ).backgroundColor;

      hasOrderNotification = false;

    }

    openOrdersBtn.children[0].style.color = backgroundColor;
  

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

  const order = await ordersModel.loadOrder( orderID );

  if ( order.status === GENERAL.ERROR ) return;

  OrderView.render({
    order: order.order,
    stopCheckingStatus: stopCheckOrderInterval,
    removeOrder: controlRemoveOrder
  }); 

  OrdersView.updateOrder( orderID, order.order.status );

  if ( order.order.status != ORDER.STATUS_COMPLETED && order.order.status != ORDER.STATUS_CANCELED ) { 

    const { backgroundColor } = statusColors.get( order.order.status );

    openOrdersBtn.children[0].style.color = backgroundColor;

  }

  if ( order.order.status !== ORDER.STATUS_COMPLETED && order.order.status !== ORDER.STATUS_CANCELED ) {

    controlStartCheckingOrderStatus( order.order._id );

  }

};

export const renderOrder = order => {

  OrdersView.addOrder( order );

};

export const controlRenderOrders = async () => {

  const orders = await ordersModel.loadOrders();

  if ( orders.status === GENERAL.ERROR ) {

    return controlRenderLogin();

  }

  OrdersView.render({
    orders: orders.orders,
    onClick: controlRenderOrder
  });  

  if ( hasOrderNotification ) {

    const {backgroundColor} = statusColors.get( ORDER.NOTHING );

    openOrdersBtn.children[0].style.color = backgroundColor;

    hasOrderNotification = false;

  }

};

export const checkUserHasActiveOrder = async () => {

  const { data: { hasPendingOrders, orderID, orderStatus } } = await ordersModel.checkUserHasActiveOrder();

  if ( hasPendingOrders ) {

    const { backgroundColor } = statusColors.get( orderStatus );

    openOrdersBtn.children[0].style.color = backgroundColor;

    controlStartCheckingOrderStatus( orderID );

  }

};