import DOMElement from '../base/DOMElement.js';
import View from '../base/View.js';
import SelectionsElement from '../general/SelectionsElement.js';

export default new class SettingsView extends View {
  _parent = document.querySelector("#main_center");

  _generateElement() {

    const language = new SelectionsElement("language", "language", "radio", [{ _id: 1, name: 'EN' },{ _id: 2, name: 'GR' }], 1, 1, () => {  });

    return new DOMElement("div").append( language.build() ).getElement();

  }

};