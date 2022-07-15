import View from "../base/View.js";
import CategoriesFilter from './CategoriesFilter.js';

import DOMElement from "../base/DOMElement.js";

export const categoriesBackBtn = new DOMElement("i")
  .setID("categories_back_btn")
  .setClass('fa-solid fa-angle-down edit_item_header_action');

export default new class CategoriesFilterView extends View {
  _parent = document.querySelector("#main_left");
  id = "categories";

  _generateHeader() {

    categoriesBackBtn.on('click', () => { this.hide(); });

    return new DOMElement("div").setClass('categories_header').append( categoriesBackBtn.getElement() ).getElement();

  }

  _generateElement() {

    const { categories } = this._data;

    const header = this._generateHeader();

    const filter = new CategoriesFilter( categories, {} ).build();

    filter.addEventListener('click', e => { e.stopPropagation(); });

    return new DOMElement("div").addClass('hidden').setID('categories').on('click', () => { this.hide(); }).append( header, filter ).getElement();

  }

  show() {  

    View.hideOverflow();

    this._element.classList.remove('hidden');

    setTimeout(() => { this._element.style.height = '100%'; }, 10);

  }

  hide() {

    View.showOverflow();

    this._element.style.height = '0%';

    setTimeout(() => { this._element.classList.add('hidden'); }, 300);

  }

};