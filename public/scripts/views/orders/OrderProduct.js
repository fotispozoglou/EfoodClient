import DOMElement from "../base/DOMElement.js";

export default class OrderProduct extends DOMElement {
  _name;
  _quantity;
  _price;
  _methods;

  constructor({ name, quantity, price }, methods) {
    super("div");

    this._name = name;
    this._quantity = quantity;
    this._price = price;
    this._methods = methods;

  } 

  build() {

    const quantity = new DOMElement("p").setClass('order_product_quantity').setText(`x${ this._quantity }`).getElement();

    const name = new DOMElement("p").setClass('order_product_name').setText( this._name ).getElement();

    const price = new DOMElement("p").setClass('order_product_price').setText(`${ this._price }€`).getElement();

    return new DOMElement("div").setClass('order_product').append( quantity, name, price ).getElement();

  }

};