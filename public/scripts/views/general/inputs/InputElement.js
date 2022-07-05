import DOMElement from "../../base/DOMElement.js";

export default class InputElement extends DOMElement {
  _value;
  _label;
  _placeholder = '';
  _valueElement;
  _errorText;
  _onInput;
  _inputTimeout;
  _defaultListener = true;

  constructor( label, value, onInput = () => {}, defaultListener = true ) {
    super("div");

    this._value = value;
    this._label = label;
    this._onInput = onInput;
    this._defaultListener = defaultListener;

    this.build();

  }

  getValue() { return this._value; }

  update( newValue ) {

    this._value = newValue;
    this._valueElement.value = this._value;

  }

  setName( name ) { this._valueElement.setAttribute('name', name); return this; }

  setType( type ) { this._valueElement.setAttribute('type', type); return this; }

  setPlaceholder( placeholder ) { this._valueElement.setAttribute('placeholder', placeholder); return this; }

  _generateHeader() {

    const labelElement = new DOMElement("label").setText( this._label ).setClass('input_label').getElement();

    return new DOMElement("div").setClass('input_header').append( labelElement ).getElement();

  }

  _generateBody() {

    this._valueElement = new DOMElement("input").setClass('input_field').attributes(['type', 'text'], ['value', this._value]).getElement();
    
    return new DOMElement("div").setClass('input_body').append( this._valueElement ).getElement();

  }

  _generateFooter() {

    this._errorText = new DOMElement("p").setClass('input_error');

    return new DOMElement("div").setClass('input_footer').append( this._errorText.getElement() ).getElement();

  }

  addInputClass( ...cls ) { this._valueElement.classList.add( ...cls ); return this; }

  addClass( ...cls ) { this._element.classList.add( ...cls ); return this; }

  resetError() {

    this._errorText.setText("");

  }

  onError( message ) {

    this._errorText.setText( message );

  }

  build() {

    const header = this._generateHeader();

    const body = this._generateBody();

    const footer = this._generateFooter();

    this._valueElement.placeholder = this._placeholder;

    this._valueElement.addEventListener('focus', () => {

      body.classList.add('focused_input');

    });

    this._valueElement.addEventListener('blur', () => {

      body.classList.remove('focused_input');

    });

    if ( this._defaultListener ) {

      this._valueElement.addEventListener('input', () => {

        this._value = this._valueElement.value;
  
        clearTimeout( this._inputTimeout );
  
        this.resetError();

        this._inputTimeout = setTimeout(() => { this._onInput( this._value ); }, 250);
  
      });

    }

    this._element = new DOMElement("div").addClass('input').append( header, body, footer ).getElement();

    return this._element;

  }

};