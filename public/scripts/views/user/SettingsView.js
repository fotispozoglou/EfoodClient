import { LANGUAGE } from '../../config/strings.js';
import DOMElement from '../base/DOMElement.js';
import View from '../base/View.js';
import SelectionsElement from '../general/SelectionsElement.js';

export default new class SettingsView extends View {
  _parent = document.querySelector("#main_center");

  _generateElement() {

    const selectedLanguage = Number( localStorage.getItem('lang') );

    const language = new SelectionsElement(
      LANGUAGE, 
      LANGUAGE, 
      "radio", 
      [{ _id: 0, name: 'English' },{ _id: 1, name: 'Ελληνικά' }], 
      selectedLanguage, 
      1, 
      selection => {  

        localStorage.setItem('lang', selection);

        document.location.reload( true );

      }
    );

    return new DOMElement("div").append( language.build() ).getElement();

  }

};