import DOMElement from './base/DOMElement.js';
import View from './base/View.js';

export default new class ErrorView extends View {
  _parent = document.querySelector("#root");
  _rerender = false;
  id = "error";

  _generateElement() {

    const { text } = this._data;

    const errorIcon = new DOMElement("img").setID("error_icon").attributes(['src', '/efood_d.svg']).style(["width", "129px"]).getElement();

    const errorText = new DOMElement("p").setID("error_text").setText( text ).getElement();

    const errorAction = new DOMElement("button")
      .setID("error_action")
      .setText("reload")
      .on('click', () => { document.location.reload(true); })
      .getElement();

    const container = new DOMElement("div").setID("error_container").append( errorIcon, errorText, errorAction ).getElement();

    return new DOMElement("div").setID("error").append( container ).getElement();

  }

};