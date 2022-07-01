import DOMElement from '../base/DOMElement.js';
import View from '../base/View.js';
import InputElement from './inputs/InputElement.js';

export default new class SeriousConfirmActionView extends View {
  _parent = document.querySelector("#main_center");
  id = "serious_confirm_action_background";

  _generateElement() {

    const { title, onConfirm, confirmText, matchConfirm } = this._data;

    const titleElement = new DOMElement("p").setID("serious_confirm_action_title").setText( title ).getElement();
    
    const labelElement = new DOMElement("div")
      .setID("serious_confirm_action_label")
      
      
    if ( matchConfirm ) {
      
      labelElement.appendHTML(`<p>type '<span class="bold_text">${ confirmText }</span>' to confirm</p>`);

    } else {

      labelElement.appendHTML(`<p>type ${ confirmText } to confirm</p>`);

    }

    const deleteBtn = new DOMElement("button")
      .setID("serious_confirm_action_confirm")
      .setText("delete");

    if ( matchConfirm ) deleteBtn.setClass('faded');

    const confirmInput = new InputElement("", "", value => {

      if ( !matchConfirm ) return;

      if ( value === confirmText ) return deleteBtn.removeClass('faded');

      deleteBtn.addClass('faded');

    }, true);

    deleteBtn.on('click', () => { 

      const value = confirmInput.getValue();

      if ( !matchConfirm ) return onConfirm( value );
      
      if ( value === confirmText ) {

        onConfirm(  );

      }
    
    });

    const element = new DOMElement("div")
      .setID("serious_confirm_action")
      .append( titleElement, labelElement.getElement(), confirmInput.build(), deleteBtn.getElement() )
      .getElement();

    confirmInput.setID("serious_confirm_action_input");

    return new DOMElement("div").append( element ).getElement();

  }

};