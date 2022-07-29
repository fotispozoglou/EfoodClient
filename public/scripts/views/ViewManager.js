import View, { MAIN } from "./base/View.js";

export const openCartBtn = document.querySelector("#cart_btn_container");
export const openOrdersBtn = document.querySelector("#open_orders_btn");
export const ordersErrorIcon = document.querySelector("#orders_error_icon");
export const openAuthenticationBtn = document.querySelector("#login_navigation_btn");
export const openCategoriesBtn = document.querySelector("#categories_btn_container");
export const openOrdersContainer = document.querySelector("#orders_btn");

export const menuRight = document.querySelector("#main_right");
export const menuLeft = document.querySelector("#main_left");

export const headerLogo = document.querySelector("#header_logo");

export const userMenuBtn = document.querySelector("#user_btn");
export const closeUserMenu = document.querySelector("#close_user_menu_container");
export const userMenu = document.querySelector("#user_menu");
export const openAccountBtn = document.querySelector("#user_menu_account");
export const openPrivacyBtn = document.querySelector("#user_menu_privacy");
export const openSettingsBtn = document.querySelector("#user_menu_settings");

export default new class ViewManager {
  _renderedView = null;

  isRenderedView( view ) {

    if ( !this._renderedView ) return false;

    return this._renderedView.getID() === view.getID() && view.rendered;

  }

  hideCurrentView() {

    this._renderedView.hideElements();

    this._renderedView.remove();

  }

  render( view = View, data, hideCurrent ) {

    if ( this._renderedView ) {

      if ( view.getType() === MAIN ) this._renderedView.hideElements();

      if ( hideCurrent ) this._renderedView.remove();

    }

    view.render( data );

    if ( view.getType() === MAIN ) this._renderedView = view;

    view.showElements();

  }

};