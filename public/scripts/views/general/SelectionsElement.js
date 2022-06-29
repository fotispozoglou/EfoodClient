import DOMElement from "../base/DOMElement.js";
import SelectionInput from "./inputs/SelectionInput.js";

export default class SelectionsElement extends DOMElement {
  _name;
  _type;
  _selections;
  _selectionsElements = [  ];
  _selected;
  _onSelect;
  _selectedSelection;
  _selectedSelections = [  ];
  _maximumSelections;
  _isExpanded = false;
  _errorText;
  _id;

  constructor( name, id, type, selections, selected, maximumSelections, onSelect = () => {  } ) {
    super("div");

    this._name = name;
    this._type = type;
    this._id = id;

    this._selections = selections;
    this._selected = this._type === "radio" ? selected[ 0 ] : selected;
    this._maximumSelections = maximumSelections;
    this._onSelect = onSelect;

  }

  getSelected() { return this._type === "radio" ? [ this._selected ] : this._selected; }

  updateSelections( ...newSelections ) {

    this._selectionsElement.innerHTML = '';

    for ( const selection of newSelections ) {

      this._selections.push( selection );

      const isSelected = this.isSelected( selection._id );

      const selectionElement = new SelectionInput( selection, this._type, isSelected, selection => { this.onSelect( selection ); });

      if ( isSelected && this._type === "radio" ) this._selectedSelection = selectionElement;

      this._selectionsElements.push( selectionElement );

      this._selectionsElement.insertAdjacentElement('beforeend', selectionElement.build());

    }

  }

  showEmptyMessage() {

    console.log("EMPTY");

  }

  handleRadioSelect( selection, isSelected ) {

    const selectionID = selection.getID();

    if ( this._selectedSelection ) this._selectedSelection.unselect();

    this._selectedSelection = selection;

    this._selected = selectionID;

    return selection.select();

  }

  handleCheckboxSelect( selection, isSelected ) {

    const selectionID = selection.getID();

    if ( isSelected ) {

      this._selectedSelections.splice( this._selectionsElements.findIndex(s => s.getID() === selectionID), 1 );

      this._selected.splice( this._selected.indexOf( selectionID ), 1 );

      return selection.unselect();

    }

    if ( this._selectedSelections.length >= this._maximumSelections ) return false;

    this._selectedSelections.push( selection );

    this._selected.push( selectionID ); 

    selection.select();

  }

  onSelect( selection ) {

    this.resetError();

    const selectionID = selection.getID();

    const isSelected = this.isSelected( selectionID );

    this._type === "checkbox" ? this.handleCheckboxSelect( selection, isSelected ) : this.handleRadioSelect( selection, isSelected );   

    this._onSelect( this._selected );

  }   

  isSelected( itemID ) {

    if ( this._type === "checkbox" ) {

      return this._selected.includes( itemID );

    }

    return this._selected === itemID;

  }

  _generateSelections() {

    const selections = [  ];

    for ( const selection of this._selections ) {

      const isSelected = this.isSelected( selection._id );

      const selectionElement = new SelectionInput( selection, this._type, isSelected, selection => { this.onSelect( selection ); });

      if ( isSelected && this._type === "radio" ) this._selectedSelection = selectionElement;

      this._selectionsElements.push( selectionElement );

      selections.push( selectionElement.build() );

    }

    return new DOMElement("div").setClass('selections_inputs').append( ...selections ).getElement();

  }

  onError( message ) {

    this._errorText.setText( message );

  }

  resetError() { this._errorText.setText(""); }

  build() {

    this._selectionsElement = this._generateSelections();

    const selectionsTitle = new DOMElement("p").setClass('selections_title').setText( this._name ).getElement();

    const header = new DOMElement("div").setClass('selections_header').append( selectionsTitle ).getElement();

    this._body = new DOMElement("div").setClass('selections_body').append( this._selectionsElement ).getElement();

    this._errorText = new DOMElement("p").setClass('selections_error');

    const footer = new DOMElement("div").setClass('selections_footer').append( this._errorText.getElement() ).getElement();

    this._element = new DOMElement("div").setClass('selections').append( header, this._body, footer ).getElement();

    return this._element;

  }

};