import { PRIVACY_SETTINGS, VISIBLE_NAME, VISIBLE_PHONE } from '../../config/strings.js';
import DOMElement from '../base/DOMElement.js';
import View from '../base/View.js';
import SwitchInput from '../general/inputs/SwitchInput.js';

export default new class PrivacyView extends View {
  _parent = document.querySelector("#main_center");

  _generateElement() {

    const { preferences } = this._data;

    const { goBack, onSwitchSetting } = this._data.methods;

    const backBtn = new DOMElement("div")
      .setClass('fa-solid fa-arrow-left back_btn')
      .on('click', () => { goBack(); })
      .getElement();

    const title = new DOMElement("p")
      .setText( PRIVACY_SETTINGS )
      .setClass('privacy_settings_title')
      .getElement();

    const namePrivacy = new SwitchInput( "visible_name", VISIBLE_NAME, preferences.privateName, onSwitchSetting ).build();

    const phonePrivacy = new SwitchInput( "visible_phone", VISIBLE_PHONE, preferences.privatePhone, onSwitchSetting ).build();

    return new DOMElement("div").append( backBtn, title, namePrivacy, phonePrivacy ).getElement();

  }

};