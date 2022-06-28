import { COMMENTS } from '../../config/strings.js';
import DOMElement from '../base/DOMElement.js';
import EditItemView from '../base/EditItemView.js';
import { WINDOW } from '../base/View.js';
import NumberPicker from '../general/NumberPicker.js';

import SelectionsElement from '../general/SelectionsElement.js';

const getSuccessfulElement = message => {

  const icon = new DOMElement("i").setClass('fas fa-check-circle success_item_edit_icon').getElement();

  const messageElement = new DOMElement("p").setText( message ).setClass('success_item_edit_message').getElement();

  return new DOMElement("div").setClass('success_item_edit').append( icon, messageElement ).getElement();

};

export default new class ProductPreferences extends EditItemView {
  _parent = document.querySelector("#main");
  _priceElement;
  _type = WINDOW;

  onSuccess( message ) {

    const succElement = getSuccessfulElement( message );

    this._footer.style.display = 'none';

    this._body.empty();

    this._body.append( succElement );

    setTimeout(() => {

      succElement.remove();

      this._body.append( ...this._inputsElements );

      this._footer.style.display = 'flex';

    }, 3000);

  }

  _generateFooter() {

    const { quantity, minQuantity, price } = this._data.item;

    const actions = this._generateActions();

    const quantityElement = new NumberPicker( quantity, 100, minQuantity );

    quantityElement.onChange(value => { this._priceElement.textContent = `${ (value * price).toFixed(2) }€` });

    this.addDataElements( [ 'quantity', () => { return quantityElement.getValue(); } ] );

    return new DOMElement("div").setClass("edit_item_footer").append( quantityElement.build(), ...actions ).getElement();
    
  }

  _generateHeader() {

    const { onGoBack } = this._data.methods;

    const backBtn = new DOMElement("i").setClass('fas fa-arrow-left edit_item_header_action').on('click', () => {
      
      document.querySelector("body").style.overflow = 'auto';
      
      this.remove();
    
    }).getElement();

    const { name, price } = this._data.item;

    const title = new DOMElement("p").setClass('product_preferences_title').setText( name ).getElement();

    this._priceElement = new DOMElement("p").setClass('product_preferences_price').setText(`${ price.toFixed(2) }€`).getElement();

    const productInfoContainer = new DOMElement("div").setClass('product_info_container').append( title, this._priceElement ).getElement();

    return new DOMElement("div")
      .setClass('edit_item_header product_preferences_header')
      .append( productInfoContainer, backBtn )
      .getElement();

  }

  _generateInputs() {

    const { tiers, comments = '' } = this._data.item;

    const tiersElements = [  ];

    for ( const tier of tiers ) {

      const tierElement = new SelectionsElement( tier.name, tier._id, tier.type, tier.ingredients, tier.selectedIngredients, tier.maximumSelections, () => {  } );

      tiersElements.push( tierElement );

    }

    const commentsLabel = new DOMElement("label").setClass('comments_label').setText( COMMENTS ).getElement();

    const commentsElements = new DOMElement("textarea")
      .attributes(['placeholder', 'special instructions'])
      .setClass('product_preferences_comments')
      .setText( comments )
      .getElement();

    const commentsContainer = new DOMElement("div").setClass("comments_container").append( commentsLabel, commentsElements ).getElement();

    this.addDataElements(
      ['tiers', () => { return tiersElements.map( te => { return { _id: te._id, selected: te.getSelected(), ingredients: te._selections } })} ],
      ['comments', () => { return comments.value }]
    );

    return [ ...tiersElements.map( te => { return te.build(); } ), commentsContainer ];

  }

};