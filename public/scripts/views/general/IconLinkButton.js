import { shopRouter } from "../../controllers/shop.js";
import DOMElement from "../base/DOMElement.js";

export default class IconLinkButton extends DOMElement {
  _icon;
  _link;

  constructor( icon, link ) {
    super("a");

    this._icon = icon;
    this._link = link;

  }

  build() {

    this.setClass( `icon ${ this._icon }` ).attributes(['href', `${ this._link }`], ['role', 'link']);

    shopRouter.bindOnClick( this._element );

    return this._element;

  }

};