import DOMElement from "../base/DOMElement.js";
import ListElement from "../base/ListElement.js";
import FilterElement from "./FilterElement.js";

export default class CategoriesFilter extends DOMElement {
  _categories;
  _categoriesList;

  constructor( categories, categoriesList ) {
    super("div");

    this._categories = categories;
    this._categoriesList = categoriesList;

  }

  build() {

    const title = new DOMElement("p").setClass('categories_filter_list_title').setText('Categories').getElement();

    const categories = new ListElement( this._categories, FilterElement, "Categories", "", {} ).addClass('categories_filter_list').build();

    return new DOMElement("div").setClass('categories_filter').append( title, categories ).getElement();

  }

};