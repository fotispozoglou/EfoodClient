import * as shopModel from '../models/shop.js';

import * as productsController from './products/products.js';
import * as cartController from './cart/cart.js';
import * as authenticatationController from './authentication/authentication.js';
import * as ordersController from './orders/orders.js';
import * as userController from './user/user.js';

import ViewManager, { headerLogo, openAuthenticationBtn, openCartBtn, openCategoriesBtn, openOrdersBtn } from '../views/ViewManager.js';
import ProductsView from '../views/products/ProductsView.js';

import ErrorView from '../views/ErrorView.js';
import { GENERAL } from '../config/statusCodes.js';
import CategoriesFilterView from '../views/products/CategoriesFilterView.js';

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

  if ( openAuthenticationBtn ) {

    openAuthenticationBtn.addEventListener('click', () => {

      authenticatationController.controlRenderLogin();
  
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

  console.log("INITING");

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