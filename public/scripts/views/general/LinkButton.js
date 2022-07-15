import { shopRouter } from "../../controllers/shop.js";
import DOMElement from "../base/DOMElement.js";

export default class LinkButton extends DOMElement {
  _text;
  _link;

  constructor( text, link ) {
    super("a");

    this._text = text;
    this._link = link;

  }

  build() {

    this.setClass('link_button').setText( this._text ).attributes(['href', `${ this._link }`], ['role', 'link']);

    shopRouter.addLinkClick( this._element );

    return this._element;

  }

};