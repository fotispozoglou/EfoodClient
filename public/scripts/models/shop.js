import { API_SERVER_URL } from "../config/config.js";

import { mergeProductData } from "../helpers/mergers.js";
import * as productsDB from "../database/products.js";
import { GET } from "../general/request.js";

import { GENERAL, PRODUCTS } from '../config/statusCodes.js';

export const state = {
  products: [],
  cartProducts: [],
  productsCategories: []
};

export const updateCartProduct = async ( uuid, tiers, data ) => {

  const selectedIDS = [];

  const ingredientsNames = [];

  for ( const tier of data.tiers ) { selectedIDS.push( ...tier.selected ) };

  for ( const tier of tiers ) {

    for ( const ingredient of tier.ingredients ) {

      if ( selectedIDS.includes( ingredient._id ) ) ingredientsNames.push( ingredient.name );

    }

  }

  data.description = ingredientsNames.join(', ');

  return await productsDB.updateCartProduct( uuid, data );

};

export const getCartProductsTotalPrice = async () => {

  return await productsDB.getCartProductsTotalPrice();

};

export const updateCartProductQuantity = async ( uuid, value ) => {

  return await productsDB.updateProductQuantity( uuid, value );

};

export const addCartProduct = async ( product, productID, data ) => {

  const mergedProduct = mergeProductData({ ...product, _id: productID }, data);

  const ingredientsNames = [];

  for ( const tier of data.tiers ) {

    for ( const ingredient of tier.ingredients ) {

      if ( tier.selected.includes( ingredient._id ) ) { 
        
        ingredientsNames.push( ingredient.name );

      }

    }

  }

  mergedProduct.description = ingredientsNames.join(', ');

  state.cartProducts.push( mergedProduct );

  return await productsDB.addCartProduct( mergedProduct );

};

export const removeCartProduct = async uuid => {

  const productIndex = state.cartProducts.findIndex(product => product.uuid === uuid);

  if ( productIndex !== -1 ) state.cartProducts.splice( productIndex, 1 );

  return await productsDB.removeCartProduct( uuid );

};

export const loadCartProduct = async uuid => {

  return productsDB.getCartProduct( uuid );

};

export const loadCartProducts = async () => {

  const { data, error } = await productsDB.getCartProducts();

  if ( !error ) {

    state.cartProducts = data.products;

    return { data: { status: GENERAL.SUCCESS } };

  }

  return { error };

};

export const loadShopProducts = async () => {

  const { data: pcdata, error: pcerror } = await GET(`${ API_SERVER_URL }/productsCategories/all`);

  const { data: pdata, error: perror } = await GET(`${ API_SERVER_URL }/products/all`);

  if ( pcerror || perror ) return { error: [ pcerror, perror ], status: GENERAL.ERROR };
  
  state.productsCategories = pcdata;

  state.products = pdata;

  sortProducts();

  return { status: GENERAL.SUCCESS };

};

const sortProducts = () => {

  const productsCategoriesIDS = state.productsCategories.map(c => c._id);

  state.products.forEach(product => {

    const index = productsCategoriesIDS.indexOf( product.category );

    state.productsCategories[ index ].items.push( product );

  });

};

export const loadProduct = async id => {

  const { data, error } = await GET(`${ API_SERVER_URL }/products/${ id }/true`);

  if ( !error ) {

    return { data: data.data, status: data.status };

  }

  return { error, status: PRODUCTS.NOT_FOUND };

};

export const clearCart = async () => {

  return await productsDB.emptyCart();

};