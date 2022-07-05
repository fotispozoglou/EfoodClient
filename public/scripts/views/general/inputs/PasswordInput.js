import DOMElement from "../../base/DOMElement.js";
import InputElement from "./InputElement.js";

export default class PasswordInput extends InputElement {
  _shown = false;

  constructor( label, value, onInput = () => {}, defaultListener = true ) {
    super( label, value, onInput, defaultListener );

  }

  _generateBody() {

    this._valueElement = new DOMElement("input").setClass('input_field').attributes(['type', 'password'], ['value', this._value]).getElement();
    
    const showPasswordBtn = new DOMElement("div")
      .setClass('icon fa-solid fa-eye show_password_btn')
      .on('click', e => {

        if ( this._shown ) {

          this._valueElement.type = 'password';

          e.target.classList.replace('fa-eye-slash', 'fa-eye');

        } else {

          this._valueElement.type =  'text';

          e.target.classList.replace('fa-eye', 'fa-eye-slash');

        }

        this._shown = !this._shown;

      })
      .getElement();

    return new DOMElement("div").setClass('input_body password_input_body').append( this._valueElement, showPasswordBtn ).getElement();

  }

};