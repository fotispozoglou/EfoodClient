import View, { WINDOW } from '../base/View.js';
import CartProduct from './CartProduct.js';
import ListElement from '../base/ListElement.js';
import DOMElement from '../base/DOMElement.js';
import EmptyListItem from '../base/EmptyListItem.js';
import ViewManager from '../ViewManager.js';

export const cartBackBtn = new DOMElement("i")
  .setID("cart_back_btn")
  .setClass('fa-solid fa-angle-down edit_item_header_action');

export default new class CartView extends View {
  _parent = document.querySelector("#main_right");
  _rerender = false;
  _body;
  id = "cart";
  _footer;
  _orderBtn;
  _canOrder;
  _hasRendered = false;
  _totalPriceText;
  _type = WINDOW;
  _noItemsElement = new EmptyListItem({ _id: 1, name: 'Please fill the cart with products', icon: 'fa-solid fa-shopping-basket' }, {  }).build();

  removeCartProduct( uuid ) {

    this._body.remove( uuid );

    if ( this._body.isEmpty() ) this.setCanOrder( false );

  }

  addCartProduct( product ) {

    if ( !this._body ) return;

    this._body.add( 'pre', product );

    this.setCanOrder( true );

  }

  updateCartProduct( uuid, quantity, description ) {

    this._body.updateItem( uuid, { quantity, description } );

  }

  setCanOrder( canOrder ) {

    this._canOrder = canOrder;

    this._orderBtn.disabled = !this._canOrder;

  }

  _generateHeader() {

    cartBackBtn.on('click', () => { this.hide(); });

    const headerBackContainer = new DOMElement("div").setID("cart_navigation_header").append( cartBackBtn.getElement() ).getElement();

    const cartInfo = new DOMElement("div").setClass('cart_info').getElement();

    return new DOMElement("div").setClass('cart_header').append( headerBackContainer, cartInfo ).getElement();

  }

  show() {  

    View.hideOverflow();

    this._element.classList.remove('hidden');

    setTimeout(() => { this._element.style.height = '100%'; }, 10);

  }

  hide() {

    View.showOverflow();

    this._element.style.height = '0%';

    setTimeout(() => { this._element.classList.add('hidden'); }, 300);

  }

  updateTotalPrice( total ) {

    this._totalPriceText.textContent = `${ total } €`;

  }

  _generateElement() {

    if ( this._element ) { 
      
      return this._element;

    }

    const { items, itemMethods, orderTotal } = this._data;

    const header = this._generateHeader();

    this._body = new ListElement( items, CartProduct, "", "", itemMethods ).addClass('cart_body');

    this._body.setNoItemsItem( this._noItemsElement );

    const totalPriceLabel = new DOMElement("p").setText('Cost').setClass('total_order_price_label').getElement();

    this._totalPriceText = new DOMElement("p").setText( `${ orderTotal.toFixed( 2 ) } €` ).setClass('total_order_price_text').getElement();

    const totalPriceContainer = new DOMElement("div").setClass('total_order_price_container').append( totalPriceLabel, this._totalPriceText ).getElement();

    this._orderBtn = new DOMElement("button").setClass('order_btn').setText('order').on('click', () => { this._data.methods.onOrder() }).getElement();

    if ( items.length <= 0 ) this.setCanOrder( false ); 

    this._footer = new DOMElement("div").setClass('cart_footer').append( totalPriceContainer, this._orderBtn ).getElement();

    this._hasRendered = true;

    return new DOMElement("div").setClass('cart').append( header, this._body.build(), this._footer ).getElement();

  }

};