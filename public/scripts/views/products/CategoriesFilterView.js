import View from "../base/View.js";
import CategoriesFilter from './CategoriesFilter.js';

import DOMElement from "../base/DOMElement.js";

export const categoriesBackBtn = new DOMElement("i")
  .setID("categories_back_btn")
  .setClass('fa-solid fa-angle-down edit_item_header_action');

export default new class CategoriesFilterView extends View {
  _parent = document.querySelector("#main_left");
  id = "categories";

  _generateElement() {

    const { categories } = this._data;

    const filter = new CategoriesFilter( categories, {} ).build();

    filter.addEventListener('click', e => { e.stopPropagation(); });

    return new DOMElement("div").setID('categories').on('click', () => { this.hide(); }).append( filter ).getElement();

  }

  show() {  

    View.hideOverflow();

    setTimeout(() => { this._element.style.left = '0%'; }, 10);

  }

  hide() {

    View.showOverflow();

    setTimeout(() => { this._element.style.left = '-100%'; }, 10);

  }

};