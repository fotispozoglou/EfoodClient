import DOMElement from '../base/DOMElement.js';
import ListElement from '../base/ListElement.js';
import Product from './Product.js';

export default class ProductsCategory extends ListElement {
  _id;
  _name;

  constructor({ _id, items, name }, methods ) {
    super( items, Product, name, "", methods );

    this._id = _id;
    this._name = name;

  }

  getSearchable() { return this._name; }

  filter( value ) { 

    value = value.toUpperCase();

    let totalFound = 0;

    for ( const itemElement of this._itemsELS ) {

      if ( itemElement.getSearchable().toUpperCase().indexOf( value ) > -1 ) {

        itemElement.getElement().style.display = 'flex';

        totalFound += 1;

      } else { itemElement.getElement().style.display = 'none'; }

    }

    return totalFound;

  }

  build() {

    const title = new DOMElement("p").setClass('products_category_header_title').setText( this._name ).getElement();

    const header = new DOMElement("div").setClass('products_category_header').append( title ).getElement();

    const itemsELS = this._generateItems();

    this.setClass(`list products_category`);

    this.append( header, ...itemsELS );

    this.setID( this._name );

    return this.getElement();

  }

}