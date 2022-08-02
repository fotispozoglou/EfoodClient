import { CONFIRM_NEW_PASSWORD, CURRENT_PASSWORD, NEW_PASSWORD, SAVE } from "../../config/strings.js";
import { shopRouter } from "../../controllers/shop.js";
import DOMElement from "../base/DOMElement.js";
import View, { WINDOW } from "../base/View.js";
import PasswordInput from "../general/inputs/PasswordInput.js";

export default new class ChangePasswordView extends View {
  _parent = document.querySelector("#main_center");
  id = "change_password";
  _type = WINDOW;

  _generateElement() {

    const { savePassword } = this._data.methods;

    const backBtn = new DOMElement("div")
      .setClass('fa-solid fa-arrow-left back_btn')
      .on('click', () => { this.remove(); shopRouter.go('/account'); })
      .getElement();

    const currentPassword = new PasswordInput(CURRENT_PASSWORD, "", () => {  }, true);

    const newPassword = new PasswordInput(NEW_PASSWORD, "", () => {  }, true);

    const newPasswordConfirm = new PasswordInput(CONFIRM_NEW_PASSWORD, "", () => {  }, true);

    const saveBtn = new DOMElement("button")
      .on('click', () => { 

        savePassword( currentPassword.getValue(), newPassword.getValue(), newPasswordConfirm.getValue() ); 
      
      })
      .setText( SAVE )
      .setID("change_password_btn")
      .getElement();

    return new DOMElement("div").append( backBtn, currentPassword.build(), newPassword.build(), newPasswordConfirm.build(), saveBtn ).getElement();

  }

};