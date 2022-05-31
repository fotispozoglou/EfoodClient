import DOMElement from "../base/DOMElement.js";

export default class Product extends DOMElement {
  _id;
  _name;
  _price;
  _methods;
  _available;
  _searchableTerm;

  constructor( { _id, name, price, available }, methods ) {
    super("div");

    this._id = _id;
    this._name = name;
    this._price = price;
    this._available = available;
    this._methods = methods;
    this._searchableTerm = name.normalize("NFD").replace(/\p{Diacritic}/gu, "");

  }

  getSearchable() {

    return this._searchableTerm;

  }

  build() {

    const { onClick } = this._methods;

    const name = new DOMElement("p").setClass('product_name').setText( this._name ).getElement();

    const price = new DOMElement("p").setClass('product_price')
      .setText( this._available ? `${this._price}€` : '-' ).getElement();

    this.append( name, price );

    this.setClass('product');

    if ( this._available ) {

      this.on('click', () => { onClick( this._id ) });

    }

    if ( !this._available ) this.addClass('unavailable');

    return this._element;

  }

};