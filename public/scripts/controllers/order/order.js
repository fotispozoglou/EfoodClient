import OrderInfo from "../../views/orders/OrderInfoView.js";
import { getCartProducts } from "../../database/products.js";
import * as orderModel from '../../models/order.js';

import OrderView from "../../views/orders/OrderView.js";
import { ORDER } from "../../config/statusCodes.js";
import ViewManager, { menuRight, openOrdersBtn, ordersErrorIcon } from "../../views/ViewManager.js";

import { renderOrder } from '../orders/orders.js';
import ProductsView from "../../views/products/ProductsView.js";
import CartView from "../../views/cart/CartView.js";
import OrdersView from "../../views/orders/OrdersView.js";
import { controlRenderMessage } from "../shop.js";
import { LONG } from "../../views/general/Notification.js";

import { MESSAGE } from '../../config/types.js';
import statusColors from "../../config/colors.js";
import { clearCart } from "../../models/shop.js";
import { GENERAL } from "../../config/statusCodes.js";

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

    const { backgroundColor } = statusColors.get( ORDER.NOTHING );

    openOrdersBtn.style.color = backgroundColor;

  }

  if ( status === ORDER.STATUS_COMPLETED || status === ORDER.STATUS_CANCELED ) {

    orderModel.stopCheckOrderInterval();

  }

};

const controlStartCheckingOrderStatus = async orderID => {

  orderModel.startCheckOrderInterval( orderID, response => { controlOrderStatusChange( response, orderID ); } );

};

const controlCompleteOrder = async () => {

  const clientInfo = OrderInfo.getClientInfo();

  const { loaded, error: cartLoadError } = await orderModel.loadCartProducts();

  if ( cartLoadError || !loaded ) {
    
    clearCart();
    
    return controlRenderMessage("error loading cart");

  }

  const { orderStatus, status, orderID, order, error } = await orderModel.completeOrder( clientInfo );

  if ( error ) return controlRenderMessage("error making order", MESSAGE.MESSAGE_ERROR);

  if ( orderStatus === ORDER.HAS_PENDING_ORDER || order.status.number === ORDER.STATUS_CANCELED ) {

    return controlRenderMessage("You already have an active order", MESSAGE.MESSAGE_ERROR);

  }

  if ( !error ) {

    ViewManager.show( OrdersView, true );

    OrderView.render({
      order,
      stopCheckingStatus: () => { if ( order.status.number !== ORDER.STATUS_PENDING ) orderModel.stopCheckOrderInterval(); }
    });

    renderOrder( order );

    controlOrderStatusChange( { status: order.status }, orderID );
  
    controlStartCheckingOrderStatus( orderID ); 

  }

};

export const controlRenderOrderInfo = async () => {

  const { data = [], error } = await getCartProducts();

  if ( error ) {

    clearCart();

    return controlRenderMessage("error loading cart", MESSAGE.MESSAGE_ERROR);

  }

  CartView.hide();

  menuRight.classList.add('hidden');

  ViewManager.render( OrderInfo, {
    cartProducts: data.products,
    itemMethods: {
      completeOrder: controlCompleteOrder
    }
  }, true);

};