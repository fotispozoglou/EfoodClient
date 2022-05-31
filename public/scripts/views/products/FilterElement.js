import DOMElement from "../base/DOMElement.js";

export default class FilterElement extends DOMElement {
  _id;
  _name;

  constructor({ _id, name }) {
    super("div");

    this._id;
    this._name = name;

  }

  build() {

    const name = new DOMElement("p").setClass('filter_name').setText( this._name ).getElement();

    this._element = new DOMElement("div")
      .setClass('filter')
      .on('click', () => { 
        
        document.getElementById( this._name ).scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});

      })
      .append( name )
      .getElement();

    return this._element;

  }

};