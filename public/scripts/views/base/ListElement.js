import DOMElement from './DOMElement.js';
import ListItem from './ListItem.js';

import EmptyListItem from './EmptyListItem.js';

export default class ListElement extends DOMElement {
  _items;
  _itemsELS = [];
  _itemComponent;
  _title;
  _id;
  _itemsIDS = [  ];
  _methods;
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'No Items', icon: 'fa-solid fa-times' }, {  }).build();

  constructor( items, itemComponent = ListItem, title, id, methods ) {
    super("div");

    this._items = [ ...items ];
    this._itemComponent = itemComponent;
    this._title = title;
    this._id = id;
    this._methods = methods;

  }

  isEmpty() { return this._items.length <= 0 }

  setNoItemsItem( nii ) { this._noItemsItem = nii; }

  updateItem( itemID, itemData ) {

    let found = false;

    let itemIndex = 0;

    while ( !found && itemIndex < this._itemsELS.length ) {

      if ( itemID === this._itemsELS[ itemIndex ].getID() ) {

        this._itemsELS[ itemIndex ].update( itemData );

        found = true;

      }

      if ( !found ) itemIndex += 1;

    }

  }

  remove( ...itemsIDS ) {

    let found = false;

    let itemIndex = 0;

    while ( !found && itemIndex < this._itemsELS.length ) {

      if ( itemsIDS.includes( this._itemsELS[ itemIndex ].getID() ) ) {

        this._items.splice( itemIndex, 1 );

        this._itemsELS[ itemIndex ].remove();

        this._itemsELS.splice( itemIndex, 1 );

        found = true;

      }

      if ( !found ) itemIndex += 1;

    }

    if ( this._itemsELS.length < 1 ) {

      this.append( this._noItemsItem );

    }

  }

  refresh( ...items ) {

    for ( const itemEL of this._itemsELS ) { itemEL.remove(); }

    this._itemsELS = [  ];
    this._itemsIDS = [  ];

    this.add( ...items );

  }
 
  add( position = 'aft', ...items ) {

    if ( this._items.length < 1 ) {

      this.empty();

    }

    this._items.push( ...items );

    for ( const item of items ) {

      const itemEL = new this._itemComponent( item, this._methods );

      this._itemsELS.push( itemEL );

      this._itemsIDS.push( item._id );

      console.log(itemEL);

      if ( position === 'pre' ) this.prepend( itemEL.build() );
      else this.append( itemEL.build() );

    }

  }

  _generateItems() {

    const itemsELS = [];

    for ( const item of this._items ) {

      const itemEL = new this._itemComponent( item, this._methods );

      this._itemsELS.push( itemEL );

      this._itemsIDS.push( item._id );

      itemsELS.push( itemEL.build() );

    }

    return itemsELS;

  }

  build() {

    const itemsELS = this._generateItems();

    this.setID( this._id );
    this.addClass(`list`);

    itemsELS.length < 1 ? this.append( this._noItemsItem ) : this.append( ...itemsELS );

    return this.getElement();

  }

};