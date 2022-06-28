import DOMElement from "../base/DOMElement.js";
import statusTexts, { ORDER_STATUS_NOT_ACCURATE } from '../../config/strings.js';
import statusColors from '../../config/colors.js';

export default class OrderPreview extends DOMElement {
  _id;
  _time;
  _totalPrice;
  _orderID;
  _status;
  _methods;
  _statusErrorContainer;

  constructor({ _id, time, totalPrice, orderID, status }, methods) {
    super("div");

    this._id = _id;
    this._time = time;
    this._totalPrice = totalPrice;
    this._orderID = orderID;
    this._status = status.number;
    this._methods = methods;

  }

  getID() { return this._id }

  showStatusError() {

    this._statusErrorContainer.classList.remove('hidden');

  }

  hideStatusError() {

    this._statusErrorContainer.classList.add('hidden');

  }

  update( status ) {

    const { backgroundColor = '', color = '' } = statusColors.get( status.number );

    const { text = '' } = statusTexts.get( status.number );

    this._statusElement.setText( text ).style(['backgroundColor', backgroundColor], ['color', color]);

  }

  _getHM( date ) {

    const hours = date.getHours();

    const minutes = date.getMinutes();

    const tcs = date.toLocaleString('en-US', { hour: 'numeric', hour12: true }).slice( -2 );

    return hours >= 10 ? minutes >= 10 ? `${ hours }:${ minutes } ${ tcs }` : `${ hours }:0${ minutes } ${ tcs }` : 
          minutes >= 10 ? `0${ hours }:${ minutes } ${ tcs }` : `0${ hours }:0${ minutes } ${ tcs }`

  }

  _getReadableTime( ms ) {

    const date = new Date( ms );

    return `${ date.getDate() }/${ date.getMonth() + 1 }/${ date.getFullYear() }`; 

  }

  build() {

    const dateIcon = new DOMElement("i").setClass('fa-solid fa-calendar').getElement();

    const dateText = new DOMElement("p").setClass('order_preview_date_text').setText( this._getReadableTime( this._time.sendAt ) ).getElement();
    
    const date = new DOMElement("div").setClass('order_preview_date').append( dateIcon, dateText ).getElement();

    const timeIcon = new DOMElement("i").setClass('fa-solid fa-clock').getElement();

    const timeText = new DOMElement("p").setClass('order_preview_time_text').setText( this._getHM( new Date( this._time.sendAt ) ) ).getElement();

    const time = new DOMElement("div").setClass('order_preview_time').append( timeIcon, timeText ).getElement();

    const { backgroundColor = '', color = '' } = statusColors.get( this._status );

    const { text = '' } = statusTexts.get( this._status );

    this._statusElement = new DOMElement("p").setClass('order_preview_status').setText( text ).style(['backgroundColor', backgroundColor], ['color', color]);

    const totalPriceIcon = new DOMElement("i").setClass('fa-solid fa-euro-sign').getElement();

    const totalPriceText = new DOMElement("p").setClass('order_preview_price_text').setText( `${this._totalPrice}` ).getElement();

    const totalPrice = new DOMElement("div").setClass('order_preview_price').append( totalPriceIcon, totalPriceText ).getElement();

    const statusErrorIcon = new DOMElement("i")
      .setClass('fa-solid fa-triangle-exclamation order_header_status_error_icon')
      .getElement();

    const statusErrorText = new DOMElement("p")
      .setClass('order_header_status_error_text')
      .setText( ORDER_STATUS_NOT_ACCURATE )
      .getElement();

    this._statusErrorContainer = new DOMElement("div")
      .setClass('order_header_status_error hidden')
      .append( statusErrorIcon, statusErrorText )
      .getElement();

    this._element = new DOMElement("div")
      .setClass('order_preview')
      .on('click', () => { this._methods.onClick( this._id ) })
      .append( totalPrice, time, date, this._statusElement.getElement(), this._statusErrorContainer )
      .getElement();

    return this._element;

  }

};