import DOMElement from '../base/DOMElement.js';
import View from '../base/View.js';
import InputElement from './inputs/InputElement.js';
import PasswordInput from './inputs/PasswordInput.js';

export default new class SeriousConfirmActionView extends View {
  _parent = document.querySelector("#main_center");
  id = "serious_confirm_action_background";

  _generateElement() {

    const { title, inputType = 'text', onConfirm, informationText, confirmText, matchConfirm, goBack } = this._data;

    const cancelBtn = new DOMElement("button")
      .setID("serious_confirm_action_cancel")
      .on('click', () => { goBack(); })
      .setClass('cancel_btn')
      .setText("cancel")
      .getElement();

    const titleElement = new DOMElement("p").setID("serious_confirm_action_title").setText( title ).getElement();
    
    const labelElement = new DOMElement("div")
      .setID("serious_confirm_action_label")
      
      
    if ( matchConfirm ) {
      
      labelElement.appendHTML(`<p>type '<span class="bold_text">${ informationText }</span>' to confirm</p>`);

    } else {

      labelElement.appendHTML(`<p>type ${ informationText } to confirm</p>`);

    }

    const confirmBtn = new DOMElement("button")
      .setID("serious_confirm_action_confirm")
      .setText( confirmText );

    if ( matchConfirm ) confirmBtn.setClass('faded');

    const InputTypeComponent = inputType === "password" ? PasswordInput : InputElement;

    const confirmInput = new InputTypeComponent("", "", value => {

      if ( !matchConfirm ) return;

      if ( value === confirmText ) return confirmBtn.removeClass('faded');

      confirmBtn.addClass('faded');

    }, true);

    confirmBtn.on('click', () => { 

      const value = confirmInput.getValue();

      if ( !matchConfirm ) return onConfirm( value );
      
      if ( value === confirmText ) {

        onConfirm(  );

      }
    
    });

    const actionContainer = new DOMElement("div")
      .setID("serious_confirm_action_actions")
      .append( cancelBtn, confirmBtn.getElement() )
      .getElement();

    const element = new DOMElement("div")
      .setID("serious_confirm_action")
      .append( titleElement, labelElement.getElement(), confirmInput.build(), actionContainer )
      .getElement();

    confirmInput.setType( inputType );

    confirmInput.setID("serious_confirm_action_input");

    return new DOMElement("div").append( element ).getElement();

  }

};