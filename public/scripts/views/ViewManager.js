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

window.rViews = [];

export default new class ViewManager {
  _renderedViews = [  ];
  _renderFunctions = [  ];
  
  init( view = View, renderFunction, data ) {

    this._renderedViews = [ view ];

    this._renderFunctions = [ renderFunction ];

    view.render( data );

  }

  reset( view = View, renderFunction, data ) {

    if ( this._renderedViews.length > 1 ) {

      for ( let index = this._renderedViews.length - 1; index >= 1; index -= 1 ) {

        this._renderedViews[ index ].remove();

        this._renderFunctions.splice( index, 1 );

        this._renderedViews.splice( index, 1 );

      }

    }

    this._renderedViews = [ view ];

    this._renderFunctions = [ renderFunction ];

    view.render( data );

  }

  renderPrevious() {

    this._renderedViews[ this._renderedViews.length - 1 ].hideElements();

    this._renderedViews[ this._renderedViews.length - 1 ].remove();

    this._renderFunctions.splice( this._renderFunctions.length - 1, 1 );

    this._renderedViews.splice( this._renderedViews.length - 1, 1 );

    this._renderFunctions[ this._renderFunctions.length - 1 ]();

  }

  render( view = View, renderFunction, data, hideCurrent ) {

    if ( view.getType() === MAIN ) {

      this._renderedViews[ this._renderedViews.length - 1 ].hideElements();

      if ( hideCurrent ) this._renderedViews[ this._renderedViews.length - 1 ].remove();

      if ( view.getID() !== this._renderedViews[ this._renderedViews.length - 1 ].getID() ) {

        this._renderedViews.push( view );
        
        this._renderFunctions.push( renderFunction );

      }

      console.log(this._renderedViews.map(e => e.id).join(','));

    }

    view.render( data );

    view.showElements();

  }

};