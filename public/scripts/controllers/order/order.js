import OrderInfo from "../../views/orders/OrderInfoView.js";
import { getCartProducts } from "../../database/products.js";
import * as orderModel from '../../models/order.js';

import OrderView from "../../views/orders/OrderView.js";
import { ORDER } from "../../config/statusCodes.js";
import ViewManager, { menuRight, openOrdersBtn, ordersErrorIcon } from "../../views/ViewManager.js";

import { controlRenderOrders, renderOrder } from '../orders/orders.js';
import ProductsView from "../../views/products/ProductsView.js";
import CartView from "../../views/cart/CartView.js";
import OrdersView from "../../views/orders/OrdersView.js";
import { controlRenderMessage } from "../shop.js";
import { LONG } from "../../views/general/Notification.js";

import { MESSAGE } from '../../config/types.js';
import statusColors from "../../config/colors.js";
import { clearCart } from "../../models/shop.js";
import { GENERAL } from "../../config/statusCodes.js";
import { ALREADY_ACTIVE_ORDER, ERROR_LOADING_CART, ERROR_MAKING_ORDER, NEED_TO_SIGNIN } from "../../config/strings.js";
import { controlRenderLogin } from "../authentication/authentication.js";

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
    
    return controlRenderMessage( ERROR_LOADING_CART, MESSAGE.MESSAGE_ERROR );

  }

  const { orderStatus, status, orderID, order, error } = await orderModel.completeOrder( clientInfo );

  if ( error ) return controlRenderMessage( ERROR_MAKING_ORDER , MESSAGE.MESSAGE_ERROR);

  if ( orderStatus === GENERAL.NOT_AUTHENTICATED ) {

    controlRenderLogin();

    return controlRenderMessage( NEED_TO_SIGNIN, MESSAGE.MESSAGE_ERROR );

  }

  if ( orderStatus === ORDER.HAS_PENDING_ORDER || order.status.number === ORDER.STATUS_CANCELED ) {

    return controlRenderMessage( ALREADY_ACTIVE_ORDER , MESSAGE.MESSAGE_ERROR);

  }

  if ( !error ) {

    await controlRenderOrders();

    ViewManager.render( OrderView, () => {  }, {  
      order,
      stopCheckingStatus: () => { if ( order.status.number !== ORDER.STATUS_PENDING ) orderModel.stopCheckOrderInterval(); }
    }, false );

    controlOrderStatusChange( { status: order.status }, orderID );
  
    controlStartCheckingOrderStatus( orderID ); 

  }

};

export const controlRenderOrderInfo = async () => {

  const { data = [], error } = await getCartProducts();

  if ( error ) {

    clearCart();

    return controlRenderMessage( ERROR_LOADING_CART , MESSAGE.MESSAGE_ERROR);

  }

  CartView.hide();

  menuRight.classList.add('hidden');

  ViewManager.render( OrderInfo, controlRenderOrderInfo, {
    cartProducts: data.products,
    itemMethods: {
      completeOrder: controlCompleteOrder
    }
  }, true);

};