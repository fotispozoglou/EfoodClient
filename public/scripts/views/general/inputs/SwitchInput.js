import DOMElement from "../../base/DOMElement.js";

export default class SwitchInput extends DOMElement {
  _name;
  _title;
  _value;
  _onSwitch;

  constructor( name, title, value, onSwitch ) {
    super("div");

    this._name = name;
    this._title = title;
    this._value = value;
    this._onSwitch = onSwitch;

  }

  build() {

    const title = new DOMElement("p").setText( this._title ).setClass('switch_element_title').getElement();
    
    const switchCircleColor = new DOMElement("div")
      .setClass('switch_circle_color')
      .getElement();

    const switchCircle = new DOMElement("div")
      .setClass('switch_circle')
      .append( switchCircleColor )
      .getElement();

    const switchCircleContainer = new DOMElement("div")
      .setClass('switch_circle_container')
      .append( switchCircle )
      .getElement();

    this.append( title, switchCircleContainer );

    if ( this._value ) switchCircle.classList.add('switch_enable');

    this.on('click', () => {

      if ( this._value ) {

        switchCircle.classList.remove('switch_enable');

      } else {

        switchCircle.classList.add('switch_enable');

      }

      this._value = !this._value;

      this._onSwitch( this._name, this._value );

    });

    this.setClass('switch_element');

    return this.getElement();

  }

}