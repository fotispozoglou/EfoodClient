import * as shopModel from '../../models/shop.js';
import ProductsView from '../../views/products/ProductsView.js';
import ProductPreferences from '../../views/products/ProductPreferences.js';

import CartView from '../../views/cart/CartView.js';
import CategoriesFilterView from '../../views/products/CategoriesFilterView.js';
import { hideProgressBar, setProgress, showProgressBar } from '../../views/ProgressBar.js';

import { MESSAGE } from '../../config/types.js';

import { controlRenderMessage } from '../../general/messages.js';
import { LONG } from '../../views/general/Notification.js';

import { PRODUCTS } from '../../config/statusCodes.js';
import ViewManager from '../../views/ViewManager.js';
import { ADD, ERROR_LOADING_PRODUCT, ORDER_TOTAL_NOT_ACCURATE } from '../../config/strings.js';

const controlAddCartProduct = async ( product, productID ) => {

  const productData = ProductPreferences.getViewData('all');

  const { data, error } = await shopModel.addCartProduct( product, productID, productData );

  if ( error ) return controlRenderMessage("error adding product", MESSAGE.MESSAGE_ERROR, LONG);

  const { added } = data;

  CartView.addCartProduct( added );

  const { data: totalData, error: totalError } = await shopModel.getCartProductsTotalPrice();

  if ( totalError ) controlRenderMessage( ORDER_TOTAL_NOT_ACCURATE , MESSAGE.MESSAGE_ERROR, LONG);

  if ( !totalError ) CartView.updateTotalPrice( totalData.total.toFixed( 2 ) );

  ProductPreferences.onSuccess("Product Added Successfully");

};

export const controlRenderAddCartProduct = async productID => {

  showProgressBar();

  setProgress( 0 );

  const { data: product, status, error } = await shopModel.loadProduct( productID );

  if ( error || status === PRODUCTS.NOT_FOUND ) {

    hideProgressBar();

    return controlRenderMessage( ERROR_LOADING_PRODUCT, MESSAGE.MESSAGE_ERROR, LONG );

  }

  setProgress( 100 );

  document.querySelector("body").style.overflow = 'hidden';

  ProductPreferences.render({
    item: product,
    methods: {},
    actions: [ { name: ADD, exec: () => { controlAddCartProduct( product, productID ); } } ]
  });

  hideProgressBar();

};

export const controlRenderProductCategoriesFilter = () => {

  CategoriesFilterView.render({
    categories: shopModel.state.productsCategories
  });

};

export const controlRenderProducts = () => {

  ViewManager.render( ProductsView, controlRenderProducts, {
    items: shopModel.state.productsCategories,
    itemMethods: {
      onClick: controlRenderAddCartProduct
    },
    methods: {

    }
  }, true);

};
