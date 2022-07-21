import View, { MAIN } from "../base/View.js";
import ListElement from "../base/ListElement.js";
import DOMElement from "../base/DOMElement.js";
import OrderProduct from "./OrderProduct.js";
import OrderClientInfo from "./OrderClientInfo.js";
import { COMPLETE_ORDER, ORDER_LABEL, PRODUCTS } from "../../config/strings.js";

export const viewID = Math.floor( Math.random() * 100000 );

export const orderInfoBackBtn = document.querySelector("#order_info_back_btn");

export default new class OrderInfoView extends View {
  _parent = document.querySelector("#main_center");
  _rerender = false;
  _canOrder = false;
  _completeOrderBtn;
  _clientInfo;
  _type = MAIN;
  viewID = viewID;

  setData( data ) { this._data = data; }
 
  setCanOrder( canOrder ) {

    this._canOrder = canOrder;

    if ( canOrder ) {

      this._completeOrderBtn.style.opacity = '1';

      return this._completeOrderBtn.disabled = false;

    } 

    this._completeOrderBtn.style.opacity = '0.5';

    this._completeOrderBtn.disabled = true;

  }

  getClientInfo() {

    return this._clientInfo.getClientInfo();

  }

  hide() { this.remove(); delete this; }

  _generateElement() {

    const { cartProducts, totalPrice, itemMethods } = this._data;

    const totalPriceTitle = new DOMElement("p").setID("order_cart_total_title").setText('Συνολο').getElement();

    const totalPriceText = new DOMElement("p").setID("order_cart_total_price").setText(`${ totalPrice } €`).getElement();

    const totalPriceContainer = new DOMElement("div").setID("order_cart_total_container").append( totalPriceTitle, totalPriceText ).getElement();

    const productsTitle = new DOMElement("p").setText( PRODUCTS ).setID("order_cart_title").getElement();

    const productsList = new ListElement( cartProducts, OrderProduct, "", "", itemMethods ).addClass('order_cart_products').build();

    const clientTitle = new DOMElement("p").setText( ORDER_LABEL ).setID("order_client_title").getElement();

    this._clientInfo = new OrderClientInfo({  }, {});

    const productsContainer = new DOMElement("div").setID("order_cart_container").append( productsTitle, productsList, totalPriceContainer ).getElement();

    const clientContainer = new DOMElement("div").setID("order_client_container").append( clientTitle, this._clientInfo.build() ).getElement();

    const body = new DOMElement("div").setClass('order_info_body').append( productsContainer, clientContainer ).getElement();

    this._completeOrderBtn = new DOMElement("button")
      .setID('complete_order_btn')
      .setText( COMPLETE_ORDER )
      .on('click', () => {

        if ( this._canOrder  ) {

          return itemMethods.completeOrder();

        }

      })
      .getElement();

    this.setCanOrder( false );

    setTimeout(() => { this.setCanOrder( true ) }, 2000);

    const footer = new DOMElement("div").setClass('order_info_footer').append( this._completeOrderBtn ).getElement();

    return new DOMElement("div").setClass('order_info').append( body, footer ).getElement();

  }

};