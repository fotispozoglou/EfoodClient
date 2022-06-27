import DOMElement from "../../base/DOMElement.js";

export default class SwitchInput extends DOMElement {
  _title;
  _value;

  constructor( title, value ) {
    super("div");

    this._title = title;
    this._value = value;

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

    this.on('click', () => {

      if ( this._value ) {

        switchCircle.classList.remove('switch_enable');

      } else {

        switchCircle.classList.add('switch_enable');

      }

      this._value = !this._value;

    });

    this.setClass('switch_element');

    return this.getElement();

  }

}