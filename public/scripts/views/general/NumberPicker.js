import DOMElement from "../base/DOMElement.js";

export default class NumberPicker extends DOMElement {
  _value;
  _initialValue;
  _maximumValue;
  _minimumValue;
  _increaseBtn;
  _decreaseBtn;
  _numberElement;
  _onChange = () => {};

  constructor( initialValue, maximumValue, minimumValue ) {
    super("div");

    this._initialValue = initialValue;
    this._value = this._initialValue;
    this._maximumValue = maximumValue;
    this._minimumValue = minimumValue;

  }

  getValue() {

    return this._value; 

  }

  setValue( value ) {

    this._value = value;

    this._updateText();

  }

  onChange( callback ) {

    this._onChange = callback;

  }

  _updateText() {

    this._numberElement.setText( this._value );

  }

  increase() {

    if ( this._value + 1 > this._maximumValue ) {

      this._value = this._initialValue;

      this._onChange( this._value );

      return this._updateText();

    }

    this._value += 1;

    this._onChange( this._value );

    this._updateText();

  }

  decrease() {

    if ( this._value - 1 < this._minimumValue ) {

      return;

    }

    this._value -= 1;

    this._onChange( this._value );

    this._updateText();

  }

  build() {

    this._increaseBtn = new DOMElement("i").setClass('fa-solid fa-plus number_picker_increase number_picker_btn').on('click', () => { this.increase(); }).getElement();

    this._numberElement = new DOMElement("p").setClass('number_picker_text').setText( this._initialValue );

    this._decreaseBtn = new DOMElement("i").setClass('fa-solid fa-minus number_picker_decrease number_picker_btn').on('click', () => { this.decrease(); }).getElement();

    this.setClass('number_picker');

    this.append( this._decreaseBtn, this._numberElement.getElement(), this._increaseBtn );

    return this._element;

  }

};