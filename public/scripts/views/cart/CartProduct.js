import DOMElement from "../base/DOMElement.js";
import NumberPicker from "../general/NumberPicker.js";

export default class CartProduct extends DOMElement {
  _id;
  _uuid;
  _name;
  _price;
  _quantity;
  _minQuantity;
  _description;
  _methods;
  _descriptionElement;
  _priceElement;

  constructor({ _id, uuid, name, price, quantity, minQuantity, description }, methods) {
    super("div");

    this._id = _id;
    this._uuid = uuid;
    this._name = name;
    this._price = price;
    this._quantity = quantity;
    this._minQuantity = minQuantity;
    this._description = description;
    this._methods = methods;

  }

  getID(  ) { return this._uuid; }

  update({ quantity, description }) {

    this._quantity = quantity;

    this._quantityElement.setValue( quantity );

    this._priceElement.setText(`${ (this._quantity * this._price).toFixed(2) }$`);

    this._descriptionElement.textContent = description;

  }

  build() {

    const name = new DOMElement("p").setClass('cart_product_name').setText( this._name ).on('click', () => { this._methods.onClick( this._uuid ) }).getElement();

    const removeBtn = new DOMElement("i").setClass('fa-solid fa-times cart_product_remove').on('click', () => { this._methods.remove( this._uuid ); }).getElement();

    const header = new DOMElement("div").setClass('cart_product_header').append( name, removeBtn ).getElement();

    this._descriptionElement = new DOMElement("p").setClass('cart_product_description').setText( this._description ).getElement();

    const body = new DOMElement("div").setClass('cart_product_body').append( this._descriptionElement ).getElement();

    this._quantityElement = new NumberPicker( this._quantity, 100, this._minQuantity );

    this._priceElement = new DOMElement("p").setText( `${ (this._quantity * this._price).toFixed(2) } €` ).setClass('cart_product_price');

    this._quantityElement.onChange( quantityValue => { 
      
      const updated = this._methods.quantityChange( this._uuid, quantityValue );

      if ( updated ) return this._priceElement.setText( `${ (quantityValue * this._price).toFixed(2) }$` );

      this._quantityElement.reverse();

    });

    // const disableBtn = new DOMElement("i").setClass('fa-solid fa-minus-square disable_product_btn').getElement();

    // const disableBtn = new DOMElement("button").setClass('disable_product_btn').setText('remove for this order').getElement();

    const footer = new DOMElement("div").setClass('cart_product_footer').append( this._quantityElement.build(), this._priceElement.getElement() ).getElement();

    this._element = new DOMElement("div").append( header, body, footer ).setClass('cart_product').getElement();

    return this._element;

  }

};