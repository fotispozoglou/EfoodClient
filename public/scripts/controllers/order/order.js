import OrderInfo from "../../views/orders/OrderInfoView.js";
import { getCartProducts } from "../../database/products.js";
import * as orderModel from '../../models/order.js';

import OrderView from "../../views/orders/OrderView.js";
import { ORDER } from "../../config/statusCodes.js";
import ViewManager, { menuRight, openOrdersBtn } from "../../views/ViewManager.js";

import { renderOrder } from '../orders/orders.js';
import ProductsView from "../../views/products/ProductsView.js";
import CartView from "../../views/cart/CartView.js";
import OrdersView from "../../views/orders/OrdersView.js";
import { controlRenderMessage } from "../shop.js";
import { LONG } from "../../views/general/Notification.js";

import { MESSAGE } from '../../config/types.js';
import statusColors from "../../config/colors.js";

const controlOrderStatusChange = async ( status, orderID ) => {

  OrderView.updateStatus( status );

  OrdersView.updateOrder( orderID, status );

  if ( status != ORDER.STATUS_COMPLETED && status != ORDER.STATUS_CANCELED ) { 

    const { backgroundColor } = statusColors.get( status );

    openOrdersBtn.children[0].style.color = backgroundColor;

  } else {

    const { backgroundColor } = statusColors.get( ORDER.NOTHING );

    openOrdersBtn.children[0].style.color = backgroundColor;
  

  }

  if ( status === ORDER.STATUS_COMPLETED || status === ORDER.STATUS_CANCELED ) {

    orderModel.stopCheckOrderInterval();

  }

};

const controlStartCheckingOrderStatus = async orderID => {

  orderModel.startCheckOrderInterval( orderID, status => { controlOrderStatusChange( status, orderID ); } );

};

const controlCompleteOrder = async () => {

  const clientInfo = OrderInfo.getClientInfo();

  await orderModel.loadCartProducts();

  const { status, orderID, order, error } = await orderModel.completeOrder( clientInfo );

  if ( status === ORDER.HAS_PENDING_ORDER || order.status === ORDER.STATUS_CANCELED ) {

    return controlRenderMessage({ 
      text: "You already have an active order",  
      type: MESSAGE.MESSAGE_ERROR,
      duration: LONG
    });

  }

  if ( !error ) {

    ViewManager.show( OrdersView, true );

    OrderView.render({
      order,
      stopCheckingStatus: () => { if ( order.status !== ORDER.STATUS_PENDING ) orderModel.stopCheckOrderInterval(); }
    });

    renderOrder( order );

    controlOrderStatusChange( order.status, orderID );
  
    controlStartCheckingOrderStatus( orderID ); 

  }

};

export const controlRenderOrderInfo = async () => {

  const cartProducts = await getCartProducts();

  CartView.hide();

  menuRight.classList.add('hidden');

  OrderInfo.render({
    cartProducts,
    itemMethods: {
      completeOrder: controlCompleteOrder
    }
  });

  ViewManager.show( OrderInfo, true );

};