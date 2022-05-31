import * as shopModel from '../../models/shop.js';
import ProductsView from '../../views/products/ProductsView.js';
import ProductPreferences from '../../views/products/ProductPreferences.js';

import CartView from '../../views/cart/CartView.js';
import CategoriesFilterView from '../../views/products/CategoriesFilterView.js';
import { hideProgressBar, setProgress, showProgressBar } from '../../views/ProgressBar.js';

import { MESSAGE } from '../../config/types.js';

import { controlRenderMessage } from '../shop.js';
import { LONG } from '../../views/general/Notification.js';

import { PRODUCTS } from '../../config/statusCodes.js';

const controlAddCartProduct = async ( product, productID ) => {

  const data = ProductPreferences.getViewData('all');

  const addedProduct = await shopModel.addCartProduct( product, productID, data );

  CartView.addCartProduct( addedProduct );

  const totalPrice = await shopModel.getCartProductsTotalPrice();

  CartView.updateTotalPrice( totalPrice.toFixed( 2 ) );

  ProductPreferences.onSuccess("Product Added Successfully");

};

const controlRenderAddCartProduct = async productID => {

  showProgressBar();

  setProgress( 0 );

  const { data: product, status, error } = await shopModel.loadProduct( productID );

  if ( error || status === PRODUCTS.NOT_FOUND ) {

    hideProgressBar();

    const errorMessage = { text: "error loading product", type: MESSAGE.MESSAGE_ERROR, duration: LONG };

    return controlRenderMessage( errorMessage );

  }

  setProgress( 100 );

  document.querySelector("body").style.overflow = 'hidden';

  ProductPreferences.render({
    item: product,
    methods: {},
    actions: [ { name: 'add', exec: () => { controlAddCartProduct( product, productID ); } } ]
  });

  hideProgressBar();

};

export const controlRenderProductCategoriesFilter = () => {

  CategoriesFilterView.render({
    categories: shopModel.state.productsCategories
  });

};

export const controlRenderProducts = () => {

  ProductsView.render({
    items: shopModel.state.productsCategories,
    itemMethods: {
      onClick: controlRenderAddCartProduct
    },
    methods: {

    }
  });

};
