import DOMElement from "../../base/DOMElement.js";
import InputElement from "./InputElement.js";

export default class NumberInput extends InputElement {
  _initialValue;
  _increment;
  _minimumValue;
  _maximumValue;
  _defaultListener = false;

  constructor( label, initialValue, increment, minimumValue, maximumValue ) {
    super( label, parseFloat( initialValue ), undefined, false );

    this._initialValue = parseFloat(initialValue);
    this._increment = parseFloat(increment);
    this._minimumValue = parseInt(minimumValue);
    this._maximumValue = parseInt(maximumValue);

  }

  round( value, precision ) {

    const multiplier = Math.pow(10, precision || 0);
  
    return Math.round(value * multiplier) / multiplier;
  
  }

  increase() {

    this._value = this.round( this._value + this._increment, 2 );

    this.update( this._value );

  }

  decrease() {

    this._value = this.round( this._value - this._increment, 2 );

    this.update( this._value );

  }

  _generateBody() {

    const decreaseBtn = new DOMElement("i")
      .setClass('fa-solid fa-angle-down number_input_btn number_input_btn_left')
      .on('click', () => { this.resetError(); this.decrease(); })
      .getElement();

    const increaseBtn = new DOMElement("i")
      .setClass('fa-solid fa-angle-up number_input_btn number_input_btn_right')
      .on('click', () => { this.resetError(); this.increase(); })
      .getElement();

    this._valueElement = new DOMElement("input").setClass('number_input_field').attributes(['type', 'text'], ['value', this._value]).getElement();

    this._valueElement.addEventListener('input', e => {

      const { value } = this._valueElement;

      this.resetError();

      if ( value.length > 0 ) this.update( Number.isInteger( Number( value ) ) ? parseFloat( value ) : parseFloat( this._value ) );

    });

    return new DOMElement("div").setClass('input_body').append( this._valueElement, decreaseBtn, increaseBtn ).getElement();

  }

};