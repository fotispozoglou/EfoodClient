import View from "./base/View.js";
import CartView from "./cart/CartView.js";
import { orderInfoBackBtn } from "./orders/OrderInfoView.js";
import OrdersView, { ordersBackBtn } from "./orders/OrdersView.js";
import ProductsView, { searchProducts } from "./products/ProductsView.js";
import AuthenticationView from './authentication/AuthenticationView.js';
import CategoriesFilterView from "./products/CategoriesFilterView.js";

export const openCartBtn = document.querySelector("#cart_btn_container");
export const openOrdersBtn = document.querySelector("#open_orders_btn");
export const ordersErrorIcon = document.querySelector("#orders_error_icon");
export const openAuthenticationBtn = document.querySelector("#login_navigation_btn");
export const openCategoriesBtn = document.querySelector("#categories_btn_container");
export const openOrdersContainer = document.querySelector("#orders_btn");

export const menuRight = document.querySelector("#main_right");
export const menuLeft = document.querySelector("#main_left");

export default new class ViewManager {
  _renderedView;
  _previousRenderedView;
  _navbarHeight;
  _cart;
  _showProducts = () => { 

    menuRight.style.display = 'flex';
    menuLeft.style.display = 'flex';

    this.show( ProductsView, true ); 
  
  }
  _showOrders = () => { 

    menuRight.style.display = 'none';
    menuLeft.style.display = 'none';
    
    this.show( OrdersView, true ); 
  
  }

  init( view = View ) {

    view.show();

    this._renderedView = view;

    this._previousRenderedView = view;

    this._navbarHeight = document.querySelector("#navbar").getClientRects()[0].height;

    this._cart = document.querySelector("#cart");

    document.documentElement.style
      .setProperty('--navbar-height', `${ this._navbarHeight + 20 }px`);

    this.initializeListeners();

    this.addResizeListener();

  }

  get selectedViewID() { return this._renderedView.getViewID(); }

  show( view = View, hideCurrent = false ) {

    if ( this._renderedView && hideCurrent ) { 
      
      this._renderedView.hide();

      this._renderedView.hideElements();

    }

    this._previousRenderedView = this._renderedView;

    view.show();

    view.showElements();

    this._renderedView = view;

  }

  showPrevious() {

    this._renderedView.hide();

    this._renderedView.hideElements();

    this.show( this._previousRenderedView );

  }

  disableNavbarButtons() {

    openOrdersBtn.removeEventListener( 'click', this._showOrders );

    openOrdersBtn.style.opacity = '0.5';

  }

  enableNavbarButtons() {

    openOrdersBtn.addEventListener( 'click', this._showOrders );

    openOrdersBtn.style.opacity = '1';

  }

  initializeListeners() {

    openCartBtn.addEventListener('click', () => { CartView.show(); });

    openCategoriesBtn.addEventListener('click', () => { CategoriesFilterView.show(); });
    
    if ( openAuthenticationBtn && ( window.user === undefined || window.user.isLoggedIn === undefined ) ) { 
      
      return openAuthenticationBtn.addEventListener('click', () => { this.show( AuthenticationView, false ); });

    }

    openOrdersContainer.addEventListener('click', this._showOrders);

    ordersBackBtn.addEventListener('click', this._showProducts);

    orderInfoBackBtn.addEventListener('click', () => { 
      
      this.showPrevious(); 

      menuRight.classList.remove('hidden');

      this.enableNavbarButtons();
    
    });

    searchProducts.value = "";

    searchProducts.addEventListener('input', e => {

      const { value } = searchProducts;

      ProductsView.filter( value );

    });

  }

  addResizeListener() {

    window.addEventListener('resize', e => {



    });

  }

};