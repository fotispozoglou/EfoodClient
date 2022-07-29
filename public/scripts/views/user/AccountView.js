import { ACCOUNT, ADDRESS, CHANGE_PASSWORD, DELETE_ACCOUNT, FLOOR, NAME, PHONE, SAVE, USERNAME } from '../../config/strings.js';
import DOMElement from '../base/DOMElement.js';
import View, { MAIN } from '../base/View.js';
import InputElement from '../general/inputs/InputElement.js';
import LinkButton from '../general/LinkButton.js';

export default new class AccountView extends View {
  id = "user_account";
  _parent = document.querySelector("#main_center");
  _type = MAIN;

  _generateElement() {

    const { username, name, phone, address, floor } = this._data.info;

    const { saveUserInfo } = this._data.methods;

    const title = new DOMElement("p")
      .setText( ACCOUNT )
      .setClass('privacy_settings_title')
      .getElement();

    const usernameElement = new InputElement( USERNAME, username, () => {}, true );

    const nameElement = new InputElement( NAME, name, () => {}, true );

    const phoneElement = new InputElement( PHONE, phone, () => {}, true );

    const addressElement = new InputElement( ADDRESS, address, () => {}, true );

    const floorElement = new InputElement( FLOOR, floor, () => {}, true );

    const saveBtn = new DOMElement("button")
      .setText( SAVE )
      .on('click', () => { 
        
        const info = {
          username: usernameElement.getValue(),
          name: nameElement.getValue(),
          phone: phoneElement.getValue(),
          address: addressElement.getValue(),
          floor: floorElement.getValue()
        };

        saveUserInfo( info );

      })  
      .getElement();

    const changePasswordBtn = new LinkButton( CHANGE_PASSWORD, "/account/change_password" );

    const deleteAccountBtn = new LinkButton( DELETE_ACCOUNT, "/account/delete" );

    return new DOMElement("div").append( 
      title, 
      usernameElement.getElement(), 
      nameElement.getElement(),
      phoneElement.getElement(),
      addressElement.getElement(),
      floorElement.getElement(),
      saveBtn,
      changePasswordBtn.build(),
      deleteAccountBtn.build()
    ).getElement();

  }

};