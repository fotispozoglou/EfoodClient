import * as shopModel from '../models/shop.js';

import * as productsController from './products/products.js';
import * as cartController from './cart/cart.js';
import * as authenticatationController from './authentication/authentication.js';
import * as ordersController from './orders/orders.js';
import * as userController from './user/user.js';

import { openAuthenticationBtn, openCartBtn, openCategoriesBtn } from '../views/ViewManager.js';

import ErrorView from '../views/ErrorView.js';
import { GENERAL } from '../config/statusCodes.js';
import CategoriesFilterView from '../views/products/CategoriesFilterView.js';
import { setAPIToken } from '../general/request.js';

import Router from './Router.js';
import CartView from '../views/cart/CartView.js';

export const shopRouter = new Router(['/shop', productsController.controlRenderProducts]);

export const hideLoader = () => {

  document.querySelector(".is_loading").addEventListener('animationiteration', () => {
    
    document.querySelector("#loading").classList.add('fade_away');

    document.querySelector("#loading").classList.remove('is_loading');

    setTimeout(() => { document.querySelector("#loading").classList.add('hidden'); }, 1000);

  });

};

const renderViews = async () => {

  hideLoader();
  
  productsController.controlRenderProductCategoriesFilter();

  cartController.controlRenderCart();

  if ( openAuthenticationBtn ) {

    openAuthenticationBtn.addEventListener('click', () => {

      authenticatationController.controlRenderLogin();

    });

  }

  openCartBtn.addEventListener('click', () => {

    CartView.show();

  });

  openCategoriesBtn.addEventListener('click', () => {

    CategoriesFilterView.show();

  });

  document.querySelector("#footer").classList.remove('hidden');

};

const initializeListeners = () => {

  const navbar = document.querySelector("#navbar");

  const resizeOps = () => {
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
    document.documentElement.style.setProperty("--navbar-height", navbar.clientHeight + "px");
  };

  resizeOps();

  window.addEventListener("resize", resizeOps);

};

const initializeItems = async () => {

  const { status: pstatus, error: perror } = await shopModel.loadShopProducts();

  if ( perror ) return { error: perror };

  const { data: cdata, error: cerror } = await shopModel.loadCartProducts();

  if ( cerror ) return { error: cerror };

  return { status: GENERAL.SUCCESS };

};

const init = async () => {

  setAPIToken( window.api_token, window.token, window.user ? window.user.isLoggedIn : false );

  delete window.api_token;

  const { status, error } = await initializeItems();

  if ( error && navigator.onLine ) {  hideLoader(); return ErrorView.render({ text: 'please try again in a moment' }); }

  await renderViews();  

  initializeListeners();

  shopRouter.route(
    { path: '/shop', render: productsController.controlRenderProducts },
    { path: '/account', render: userController.controlRenderUserAccount },
    { path: '/account/change_password', render: userController.controlRenderChangePassword },
    { path: '/account/delete', render: userController.controlRenderDeleteUser },
    { path: '/privacy', render: userController.controlRenderUserPrivacy },
    { path: '/settings', render: userController.controlRenderUserSettings },
    { path: '/orders', render: ordersController.controlRenderOrders },
    { path: '/orders/:orderID', render: ordersController.controlRenderOrder, originPath: '/orders' },
    { path: '/authenticate', render: authenticatationController.controlRenderLogin }
  );

  shopRouter.init( window.location.pathname );

  window.rtr = shopRouter;

  if ( window.user && window.user.isLoggedIn ) {

    ordersController.checkUserHasActiveOrder();

    await userController.initUser();

  }

};

init();