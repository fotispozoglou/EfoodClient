import * as shopModel from '../models/shop.js';

import * as productsController from './products/products.js';
import * as cartController from './cart/cart.js';
import * as authenticatationController from './authentication/authentication.js';
import * as ordersController from './orders/orders.js';

import ViewManager from '../views/ViewManager.js';
import { addNotification } from '../models/notifications.js';
import ProductsView from '../views/products/ProductsView.js';

import { MESSAGE } from '../config/types.js';

import { LONG } from '../views/general/Notification.js'
import ErrorView from '../views/ErrorView.js';
import { GENERAL } from '../config/statusCodes.js';

export const controlRenderMessage = message => {

  addNotification( message );

};

export const hideLoader = () => {

  document.querySelector(".is_loading").addEventListener('animationiteration', () => {
    
    document.querySelector("#loading").classList.add('fade_away');

    document.querySelector("#loading").classList.remove('is_loading');

    setTimeout(() => { document.querySelector("#loading").classList.add('hidden'); }, 1000);

  });

};

const renderViews = async () => {

  hideLoader();

  productsController.controlRenderProducts();

  productsController.controlRenderProductCategoriesFilter();

  cartController.controlRenderCart();

  authenticatationController.controlRenderLogin();

  document.querySelector("#footer").classList.remove('hidden');

  if ( window.user && window.user.isLoggedIn ) {

    await ordersController.controlRenderOrders();

  }

};

const initializeListeners = () => {

  ViewManager.init( ProductsView );

  const resizeOps = () => {
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
  };

  resizeOps();
  window.addEventListener("resize", resizeOps);

};

const initializeItems = async () => {

  const { status: pstatus, error: perror } = await shopModel.loadShopProducts();

  if ( perror ) return { error: perror };

  const { status: cstatus, error: cerror } = await shopModel.loadCartProducts();

  if ( cerror ) return { error: cerror };

  return { status: GENERAL.SUCCESS };

};

const init = async () => {

  const { status, error } = await initializeItems();

  console.log( error );

  if ( error ) {  hideLoader(); return ErrorView.render({ text: 'please try again in a moment' }); }

  await renderViews();

  initializeListeners();

  if ( window.user && window.user.isLoggedIn ) {

    ordersController.checkUserHasActiveOrder();

  }

};

init();