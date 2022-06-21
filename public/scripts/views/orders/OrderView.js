import DOMElement from '../base/DOMElement.js';
import ListElement from '../base/ListElement.js';
import View from '../base/View.js';

import OrderProduct from './OrderProduct.js';

import statusColors from '../../config/colors.js';
import statusTexts from '../../config/strings.js';

import { ORDER } from '../../config/statusCodes.js';

export default new class OrderVIew extends View {
  _parent = document.querySelector("#main");
  _statusText;
  _statusContainer;
  _isRendered = false;
  _orderID = "";
  _statusErrorContainer;

  isRendered() { return this._isRendered; }

  getOrderID() { return this._orderID; }

  showStatusError() {

    this._statusErrorContainer.classList.remove('hidden');

  }

  hideStatusError() {

    this._statusErrorContainer.classList.add('hidden');

  }

  updateStatus( status ) {

    if ( !this._isRendered ) return;

    const { backgroundColor, color } = statusColors.get( status.number );

    const { text } = statusTexts.get( status.number );

    this._statusText.setText( text ).style(['color', color]);

    this._statusText.style(['backgroundColor', backgroundColor]);

  }

  _generateElement() {

    const { _id, status, orderID, products, totalPrice } = this._data.order;

    this._orderID = _id;

    const { stopCheckingStatus, removeOrder } = this._data;

    const backBtn = new DOMElement("i").setClass('fas fa-arrow-left order_back_btn').on('click', () => { stopCheckingStatus(); this.remove() }).getElement();

    const titleLabel = new DOMElement("p").setClass('order_number').setText('order number').getElement();

    const title = new DOMElement("p").setClass('order_title').setText( orderID ).getElement();

    const titleContainer = new DOMElement("div").setClass('order_title_container').append( titleLabel, title ).getElement();

    const totalPriceLabel = new DOMElement("p").setClass('total_price_label').setText('total price').getElement();

    const totalPriceText = new DOMElement("p").setClass('order_total_price').setText(`${ totalPrice }€`).getElement();

    const totalPriceContainer = new DOMElement("div").setClass('order_price_container').append( totalPriceLabel, totalPriceText ).getElement();

    const header = new DOMElement("div").setClass('order_header').append( backBtn, titleContainer, totalPriceContainer ).getElement();

    const { backgroundColor, color } = statusColors.get( status.number );

    const { text } = statusTexts.get( status.number );

    this._statusText = new DOMElement("p")
      .setClass('order_status_text')
      .setText( text ).style(['color', color])
      .style(['backgroundColor', backgroundColor]);

    const statusErrorIcon = new DOMElement("i")
      .setClass('fa-solid fa-triangle-exclamation order_header_status_error_icon')
      .getElement();

    const statusErrorText = new DOMElement("p")
      .setClass('order_header_status_error_text')
      .setText('order status may not be accurate')
      .getElement();

    this._statusErrorContainer = new DOMElement("div")
      .setClass('order_header_status_error hidden')
      .append( statusErrorIcon, statusErrorText )
      .getElement();
    
    this._statusContainer = new DOMElement("div")
      .setClass('order_header_status')
      .append( this._statusErrorContainer, this._statusText.getElement() );

    const productsList = new ListElement( products, OrderProduct, "", "", {} ).build();

    const body = new DOMElement("div").setClass('order_body').append( this._statusContainer.getElement(), productsList ).getElement();

    const removeBtn = new DOMElement("button").setClass('order_action').setText('remove').on('click', () => { removeOrder( _id ); this._isRendered = false; }).getElement();

    const footer = new DOMElement("div").setClass('order_footer').getElement();

    if ( status === ORDER.STATUS_COMPLETED )  {

      footer.append( removeBtn );

    }

    const order = new DOMElement("div").setClass('order').append( header, body, footer ).on('click' , e => { e.stopPropagation();  }).getElement();

    this._isRendered = true;

    return new DOMElement("div").setClass('order_background').on('click', () => { stopCheckingStatus(); this.remove(); }).append( order ).getElement();

  }

};