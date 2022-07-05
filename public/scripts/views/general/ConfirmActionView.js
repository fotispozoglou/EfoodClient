import View from '../base/View.js';
import DOMElement from '../base/DOMElement.js';

export default new class ConfirmActionView extends View {
  _parent = document.querySelector("#root");

  _generateElement() {

    const { title, confirm } = this._data;

    const { confirmText = 'confirm', confirmExec } = confirm;

    const titleElement = new DOMElement("p").setID("confirm_action_header_title").setText( title ).getElement();

    const header = new DOMElement("div").setID("confirm_action_header").append( titleElement ).getElement();

    const cancelBtn = new DOMElement("button").setID("confirm_action_calcel").setClass('confirm_action_footer_action cancel_btn').setText( 'cancel' ).on('click', () => { this.remove(); }).getElement();

    const confirmBtn = new DOMElement("button").setID("confirm_action_confirm").setClass('confirm_action_footer_action').setText( confirmText ).on('click', () => { confirmExec(  ); }).getElement();

    const body = new DOMElement("div").setID("confirm_action_body").getElement();

    const footer = new DOMElement("div").setID("confirm_action_footer").append( cancelBtn, confirmBtn ).getElement();

    const element = new DOMElement("div").append( header, body, footer ).setID("confirm_action").getElement();

    return new DOMElement("div").append( element ).setID("confirm_action_background").getElement();

  }

}