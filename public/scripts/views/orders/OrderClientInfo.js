import DOMElement from "../base/DOMElement.js";
import InputElement from '../general/inputs/InputElement.js';

export default class OrderClientInfo extends DOMElement {
  _phoneElement;
  _addressElement;
  _floorElement;
  _commentsElement;

  constructor({ username, contact }, methods ) {
    super("div");


  }

  getClientInfo() {

    const phone = this._phoneElement.getValue();
    const address = this._addressElement.getValue();
    const floor = this._floorElement.getValue();
    const comments = this._commentsElement.value;

    return { phone, address, floor, comments };

  }

  build() {

    this._phoneElement = new InputElement("phone", "6989933500", () => {  }, false)
      .setPlaceholder('phone number')
      .addClass('order_client_info_input')

    this._addressElement  = new InputElement("address", "Kostakioi", () => {  }, false)
      .setPlaceholder('where should we deliver your food ?')
      .addClass('order_client_info_input')

    this._floorElement = new InputElement("floor", "2", () => {  }, false)
      .setPlaceholder('on which floor ? ( if any )')
      .addClass('order_client_info_input')

    const commentsLabel = new DOMElement("label").setText('comments').setClass('input_label').getElement();

    this._commentsElement = new DOMElement("textarea").setClass('input_field').attributes(['placeholder', 'instructions for the delivery or anything...']);

    return new DOMElement("div").addClass('order_client_info').append( this._phoneElement.getElement(), this._addressElement.getElement(), this._floorElement.getElement(), commentsLabel, this._commentsElement.getElement() ).getElement();

  }

};