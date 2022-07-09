import { ACCOUNT, CHANGE_PASSWORD, DELETE_ACCOUNT, NAME, PHONE, SAVE, SURNAME, USERNAME } from '../../config/strings.js';
import DOMElement from '../base/DOMElement.js';
import View, { MAIN, WINDOW } from '../base/View.js';
import InputElement from '../general/inputs/InputElement.js';

import { ordersBackBtn } from '../orders/OrdersView.js';

export default new class AccountView extends View {
  id = "user_account";
  _parent = document.querySelector("#main_center");
  _type = MAIN;

  _generateElement() {

    const { username, name, phone } = this._data.info;

    const { goBack, saveUserInfo, onChangePassword, onDeleteAccount } = this._data.methods;

    const backBtn = new DOMElement("div")
      .setClass('fa-solid fa-arrow-left back_btn')
      .on('click', () => { goBack(); })
      .getElement();

    const title = new DOMElement("p")
      .setText( ACCOUNT )
      .setClass('privacy_settings_title')
      .getElement();

    const usernameElement = new InputElement( USERNAME, username, () => {}, true );

    const nameElement = new InputElement( NAME, name, () => {}, true );

    const phoneElement = new InputElement( PHONE, phone, () => {}, true );

    const saveBtn = new DOMElement("button")
      .setText( SAVE )
      .on('click', () => { 
        
        const info = {
          username: usernameElement.getValue(),
          name: nameElement.getValue(),
          phone: phoneElement.getValue()
        };

        saveUserInfo( info );

      })  
      .getElement();

    const changePasswordBtn = new DOMElement("button")
      .setText( CHANGE_PASSWORD )
      .on('click', () => { 
        
        onChangePassword();

      })
      .getElement();

    const deleteAccountBtn = new DOMElement("button")
      .setText( DELETE_ACCOUNT )
      .on('click', () => { 
        
        onDeleteAccount();

      })
      .getElement();

    return new DOMElement("div").append( 
      backBtn, 
      title, 
      usernameElement.getElement(), 
      nameElement.getElement(),
      phoneElement.getElement(),
      saveBtn,
      changePasswordBtn,
      deleteAccountBtn
    ).getElement();

  }

};