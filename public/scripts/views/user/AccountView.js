import DOMElement from '../base/DOMElement.js';
import View, { MAIN, WINDOW } from '../base/View.js';
import InputElement from '../general/inputs/InputElement.js';

import { ordersBackBtn } from '../orders/OrdersView.js';

export default new class AccountView extends View {
  id = "user_account";
  _parent = document.querySelector("#main_center");
  _type = MAIN;

  _generateElement() {

    const { goBack } = this._data.methods;

    const backBtn = new DOMElement("div")
      .setClass('fa-solid fa-arrow-left back_btn')
      .on('click', () => { goBack(); })
      .getElement();

    const title = new DOMElement("p")
      .setText('account')
      .setClass('privacy_settings_title')
      .getElement();

    const username = new InputElement( "username", "fotis", () => {}, false );

    const name = new InputElement( "name", "Φώτης", () => {}, false );

    const surname = new InputElement( "surname", "Πόζογλου", () => {}, false );

    const phone = new InputElement( "phone number", "6936475438", () => {}, false );

    const saveBtn = new DOMElement("button")
      .setText('save')
      .on('click', () => { 
        console.log( username.getValue() ); 
      })
      .getElement();

    const changePasswordBtn = new DOMElement("button")
      .setText('change password')
      .on('click', () => { 
        console.log( username.getValue() ); 
      })
      .getElement();

    const deleteAccountBtn = new DOMElement("button")
      .setText('delete account')
      .on('click', () => { 
        console.log( username.getValue() ); 
      })
      .getElement();

    return new DOMElement("div").append( 
      backBtn, 
      title, 
      username.getElement(), 
      name.getElement(),
      surname.getElement(),
      phone.getElement(),
      saveBtn ,
      changePasswordBtn,
      deleteAccountBtn
    ).getElement();

  }

};