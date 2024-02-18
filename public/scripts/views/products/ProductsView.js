import { NO_PRODUCTS_FOUND } from '../../config/strings.js';
import DOMElement from '../base/DOMElement.js';
import ListView from '../base/ListView.js';
import { openCategoriesBtn } from '../ViewManager.js';
import ProductsCategory from './ProductsCategory.js';

export const searchProducts = document.querySelector("#search_products_input");
const cartBtn = document.querySelector("#cart_btn_container");

export default new class ProductsView extends ListView {
  _parent = document.querySelector("#products-container");
  _rerender = false;
  _noSearchText = NO_PRODUCTS_FOUND;
  id = "products";

  filter( value ) {

    let found = false;

    for ( const itemElement of this._itemsElements ) {

      const filtered = itemElement.filter( value );

      if ( filtered > 0 ) {

        found = true;

        itemElement.getElement().style.display = 'flex';

      } else { itemElement.getElement().style.display = 'none'; }

    }

    if ( found ) return this.hideNoSearched();

    if ( !this._noSearchRendered ) this.showNoSearched();

  }

  _generateHeader() {

    return new DOMElement("div").setClass('list_header').getElement();

  }

  _generateItems() {

    const items = [];

    for ( const item of this._data.items ) {

      const itemElement = new ProductsCategory( item, this._data.itemMethods || {  } );

      this._itemsElements.push( itemElement );

      items.push( itemElement.build() );

    }

    return items;

  }

  showElements() {

    searchProducts.classList.remove('hidden');
    cartBtn.classList.remove('hidden');
    openCategoriesBtn.classList.remove('hidden');
    document.querySelector("#categories").classList.remove('hidden');
    document.querySelector("#main_right").classList.remove('hidden');

  }

  hideElements() {

    searchProducts.classList.add('hidden');
    cartBtn.classList.add('hidden');
    openCategoriesBtn.classList.add('hidden');
    document.querySelector("#categories").classList.add('hidden');
    document.querySelector("#main_right").classList.add('hidden');

  }

};