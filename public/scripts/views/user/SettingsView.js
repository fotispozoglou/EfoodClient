import { LANGUAGE, languages } from '../../config/strings.js';
import DOMElement from '../base/DOMElement.js';
import View from '../base/View.js';
import SelectionsElement from '../general/SelectionsElement.js';

export default new class SettingsView extends View {
  _parent = document.querySelector("#main_center");
  id = "settings_settings";

  _generateElement() {

    const { goBack, onChangeLanguage } = this._data.methods;

    const backBtn = new DOMElement("div")
      .setClass('fa-solid fa-arrow-left back_btn')
      .on('click', () => { goBack(); })
      .getElement();

    const selectedLanguage = localStorage.getItem('lang');

    const language = new SelectionsElement(
      LANGUAGE, 
      LANGUAGE, 
      "radio", 
      [{ _id: 'EN', name: 'English' },{ _id: 'GR', name: 'Ελληνικά' }], 
      [selectedLanguage], 
      1, 
      selection => {  

        onChangeLanguage( selection );

      }
    );

    return new DOMElement("div").setID("settings_settings").append( language.build() ).getElement();

  }

};