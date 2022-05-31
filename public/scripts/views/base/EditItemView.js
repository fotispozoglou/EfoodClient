import View from "./View.js";
import DOMElement from "./DOMElement.js";

const getSuccessfulElement = message => {

  const icon = new DOMElement("i").setClass('fas fa-check-circle success_item_edit_icon').getElement();

  const messageElement = new DOMElement("p").setText( message ).setClass('success_item_edit_message').getElement();

  return new DOMElement("div").setClass('success_item_edit').append( icon, messageElement ).getElement();

};

export default class EditItemView extends View {
  _rerender = false;
  _parent = document.querySelector("#main");
  _body;
  _footer;
  _inputsElements;
  _inputs = [  ];

  onSuccess( message ) {

    const succElement = getSuccessfulElement( message );

    this._body.empty();

    this._body.append( succElement );

    setTimeout(() => {

      succElement.remove();

      this._body.append( ...this._inputsElements );

    }, 2000);

  }

  onError( errors ) {

    const fieldsNames = errors.map(error => error.field);
    const errorsMessages = errors.map(error => error.errors);

    for ( let i = 0; i < this._inputs.length; i += 1 ) {

      const fieldNameIndex = fieldsNames.findIndex(fieldName => fieldName === this._inputs[i][0]);

      if ( fieldNameIndex >= 0 ) {

        this._inputs[i][1].onError( errorsMessages[ fieldNameIndex ] );

      }

    }

  }

  _generateHeader() {

    const { onGoBack } = this._data.methods;

    const backBtn = new DOMElement("i").setClass('fas fa-arrow-left edit_item_header_action').on('click', () => { onGoBack(  ); }).getElement();

    return new DOMElement("div").setClass("edit_item_header").append( backBtn ).getElement();

  }

  _generateBody() {

    this._inputsElements = this._generateInputs();

    return new DOMElement("div").setClass("edit_item_body").append( ...this._inputsElements );

  }

  _generateActions() {

    const actions = [];

    for ( const action of this._data.actions ) {

      const actionEL = new DOMElement("button").setClass("edit_item_footer_action").setText( action.name ).getElement();

      actionEL.addEventListener('click', () => { action.exec(); } );

      actions.push( actionEL );

    }

    return actions;

  }

  _generateFooter() {

    const actions = this._generateActions();

    return new DOMElement("div").setClass("edit_item_footer").append( ...actions ).getElement();
    
  }

  showUnavailableElement() { return new DOMElement("div").setClass('unavailable_item').getElement(); }

  _generateElement() {

    const { available = true } = this._data;

    const { onGoBack } = this._data.methods;

    if ( !available ) this.showUnavailableElement();

    const header = this._generateHeader();

    this._body = this._generateBody();

    this._footer = this._generateFooter();

    const element = new DOMElement("div").setClass("edit_item").append( header, this._body.getElement(), this._footer ).getElement();

    return new DOMElement("div")
      .setClass("edit_item_background").append( element ).getElement();
    
  }

}