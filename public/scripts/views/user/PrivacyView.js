import DOMElement from '../base/DOMElement.js';
import View from '../base/View.js';
import SwitchInput from '../general/inputs/SwitchInput.js';

export default new class PrivacyView extends View {
  _parent = document.querySelector("#main_center");

  _generateElement() {

    const title = new DOMElement("p")
      .setText('privacy settings')
      .setClass('privacy_settings_title')
      .getElement();

    const namePrivacy = new SwitchInput( "visibe name", false ).build();

    const phonePrivacy = new SwitchInput( "visibe phone number", false ).build();

    return new DOMElement("div").append( title, namePrivacy, phonePrivacy ).getElement();

  }

};