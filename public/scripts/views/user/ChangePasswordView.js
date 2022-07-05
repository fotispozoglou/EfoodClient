import DOMElement from "../base/DOMElement.js";
import View from "../base/View.js";
import InputElement from "../general/inputs/InputElement.js";
import PasswordInput from "../general/inputs/PasswordInput.js";

export default new class ChangePasswordView extends View {
  _parent = document.querySelector("#main_center");
  id = "change_password";

  _generateElement() {

    const { goBack, savePassword } = this._data.methods;

    const backBtn = new DOMElement("div")
      .setClass('fa-solid fa-arrow-left back_btn')
      .on('click', () => { goBack(); })
      .getElement();

    const currentPassword = new PasswordInput("current password", "", () => {  }, true);

    const newPassword = new PasswordInput("new password", "", () => {  }, true);

    const newPasswordConfirm = new PasswordInput("confirm new password", "", () => {  }, true);

    const saveBtn = new DOMElement("button")
      .on('click', () => { 

        savePassword( currentPassword.getValue(), newPassword.getValue(), newPasswordConfirm.getValue() ); 
      
      })
      .setText('save')
      .setID("change_password_btn")
      .getElement();

    return new DOMElement("div").append( backBtn, currentPassword.build(), newPassword.build(), newPasswordConfirm.build(), saveBtn ).getElement();

  }

};