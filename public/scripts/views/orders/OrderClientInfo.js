import { ADDRESS, COMMENTS, COMMENTS_LABEL, FLOOR, PHONE } from "../../config/strings.js";
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

  showErrors( invalidFields ) {

    for ( const invalidField of invalidFields ) {

      if ( invalidField.field === "phone" ) this._phoneElement.onError( invalidField.errors );

      if ( invalidField.field === "address" ) this._addressElement.onError( invalidField.errors );

      if ( invalidField.field === "floor" ) this._floorElement.onError( invalidField.errors );

    }

  }

  build() {

    this._phoneElement = new InputElement(PHONE, "", () => {  }, true)
      .setPlaceholder('phone number')
      .addClass('order_client_info_input')

    this._addressElement  = new InputElement(ADDRESS, "", () => {  }, true)
      .setPlaceholder('where should we deliver your food ?')
      .addClass('order_client_info_input')

    this._floorElement = new InputElement(FLOOR, "", () => {  }, true)
      .setPlaceholder('on which floor ? ( if any )')
      .addClass('order_client_info_input')

    const commentsLabel = new DOMElement("label").setText( COMMENTS ).setClass('input_label').getElement();

    this._commentsElement = new DOMElement("textarea")
      .setClass('input_field')
      .attributes(['placeholder', COMMENTS_LABEL])
      .getElement();

    return new DOMElement("div").addClass('order_client_info').append( this._phoneElement.getElement(), this._addressElement.getElement(), this._floorElement.getElement(), commentsLabel, this._commentsElement ).getElement();

  }

};