import * as shopModel from '../models/shop.js';

import * as productsController from './products/products.js';
import * as cartController from './cart/cart.js';
import * as authenticatationController from './authentication/authentication.js';
import * as ordersController from './orders/orders.js';
import * as userController from './user/user.js';

import ViewManager, { closeUserMenu, headerLogo, openAccountBtn, openCartBtn, openCategoriesBtn, openOrdersBtn, userMenu, userMenuBtn } from '../views/ViewManager.js';
import { addNotification } from '../models/notifications.js';
import ProductsView from '../views/products/ProductsView.js';

import { MESSAGE } from '../config/types.js';

import { DEFAULT_DURATION, LONG } from '../views/general/Notification.js'
import ErrorView from '../views/ErrorView.js';
import { GENERAL } from '../config/statusCodes.js';
import AccountView from '../views/user/AccountView.js';
import AuthenticationView from '../views/authentication/AuthenticationView.js';
import PrivacyView from '../views/user/PrivacyView.js';
import SettingsView from '../views/user/SettingsView.js';
import CategoriesFilterView from '../views/products/CategoriesFilterView.js';

export const controlRenderMessage = ( message, type, duration = DEFAULT_DURATION ) => {

  addNotification({ text: message, type, duration });

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

  ViewManager.init( ProductsView, productsController.controlRenderProducts, {
    items: shopModel.state.productsCategories,
    itemMethods: {
      onClick: productsController.controlRenderAddCartProduct
    },
    methods: {

    }
  });

  if ( document.querySelector("#login_navigation_btn") ) {

    document.querySelector("#login_navigation_btn").addEventListener('click', () => {

      ViewManager.render( AuthenticationView, () => {}, {}, false );
  
      AuthenticationView.show();
  
    });

  }

  productsController.controlRenderProductCategoriesFilter();

  openCartBtn.addEventListener('click', () => {

    cartController.controlRenderCart();

  });

  headerLogo.addEventListener('click', () => {

    ViewManager.reset(ProductsView, productsController.controlRenderProducts, {
      items: shopModel.state.productsCategories,
      itemMethods: {
        onClick: productsController.controlRenderAddCartProduct
      },
      methods: {
  
      }
    });

  });

  openCategoriesBtn.addEventListener('click', () => {

    CategoriesFilterView.show();

  });

  // AuthenticationView.render({});

  // AuthenticationView.show();

  document.querySelector("#footer").classList.remove('hidden');

};

const initializeListeners = () => {

  const resizeOps = () => {
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
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

  const { status, error } = await initializeItems();

  if ( error && navigator.onLine ) {  hideLoader(); return ErrorView.render({ text: 'please try again in a moment' }); }

  await renderViews();

  initializeListeners();

  if ( window.user && window.user.isLoggedIn ) {

    ordersController.checkUserHasActiveOrder();

    await userController.initUser();

    openOrdersBtn.addEventListener('click', () => {

      ordersController.controlRenderOrders();
  
    });

  }

};

init();