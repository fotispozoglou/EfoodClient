import DOMElement from "./DOMElement.js";

export const MAIN = 1;
export const WINDOW = 2;

export default class View {
  _viewID = Math.floor( Math.random() * 10000 );
  _data;
  _element;
  _rerender = false;
  _rendered = false;
  _dataElements = [];
  _parent = document.querySelector("#main");
  id = "";
  _onHide;
  _type = MAIN;

  render( data ) {

    if ( data ) this._data = data;

    this._element = this._generateElement();

    this._rendered = true;

    // if ( this._rerender ) this._parent.innerHTML = '';

    this._element.id = this.id;

    this._parent.insertAdjacentElement('beforeend', this._element);

  }

  get rendered() { return this._rendered; }

  setType( type ) { this._type = type; }

  setData( data ) { this._data = data; }

  getType() { return this._type; }

  getID() { return this._viewID }

  addDataElements( ...dataElements ) {  

    for ( const dataElement of dataElements ) {

      this._dataElements.push({ name: dataElement[ 0 ], getValue: dataElement[ 1 ] });

    }

  }

  getViewData( requested ) {

    let data = {};

    for ( const dataElement of this._dataElements ) {

      data[ dataElement['name'] ] = dataElement.getValue();

    }

    return data;

  }

  show() { this._element.classList.remove('hidden'); this._element.style.display = 'flex'; }

  hide() { this._element.classList.add('hidden'); this._element.style.display = 'none'; }

  showElements() {  }

  hideElements() {  }

  static hideOverflow() {

    document.querySelector("body").style.overflow = 'hidden';

  }

  static showOverflow() {

    document.querySelector("body").style.overflow = 'auto';

  }

  remove() { this._element.remove(); delete this; }

  _generateElement() { return new DOMElement("div"); }

}