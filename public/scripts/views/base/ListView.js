import ListItem from './ListItem.js';
import View from './View.js';
import DOMElement from './DOMElement.js';
import EmptyListItem from '../base/EmptyListItem.js';

export default class ListView extends View {
  _itemsElements = [];
  _filteredElements = [];
  _items = [];
  _body;
  _searchable = false;
  _hasRendered = false;
  _itemComponent = ListItem;
  _noSearchText = "No Items Found";
  _noSearchRendered = true;
  _noSearch = new EmptyListItem({ _id: 2, name: '', icon: 'fa-solid fa-magnifying-glass' }, {  });

  _generateHeader() {

    return new DOMElement("div").setClass('list_header').getElement();

  }

  hideNoSearched() {

    console.log(1);

    this._noSearch.remove();

    this._noSearchRendered = false;

  }

  showNoSearched() {

    console.log(1);

    if ( !this._body ) return;

    this.hideNoSearched();

    this._noSearch.updateName( this._noSearchText );

    this._body.append( this._noSearch.build() );

    this._noSearchRendered = true;

  }

  filter( value ) {

    this._filteredElements = [  ];

    value = value.toUpperCase();

    let found = false;

    for ( const itemElement of this._itemsElements ) {

      if ( itemElement.getSearchable().toUpperCase().indexOf( value ) > -1 ) {

        found = true;

        itemElement.getElement().style.display = 'block';

      } else { itemElement.getElement().style.display = 'none'; }

    }

    if ( found ) return this.hideNoSearched();

    if ( !this._noSearchRendered ) this.showNoSearched();

  }

  add( ...items ) {

    for ( const item of items ) {

      const itemElement = new this._itemComponent( item, this._data.itemMethods || {  } );

      this._itemsElements.push( itemElement );

      this._items.push( item );

      this._body.append( itemElement.build() );

    }

  }

  removeItems( ...itemsIDS ) {

    let foundAll = false;
    let totalFound = 0;

    let itemsIndex = 0;

    while ( !foundAll && itemsIndex < this._itemsElements.length ) {

      console.log(`${this._itemsElements[ itemsIndex ].getID()}`);

      if ( itemsIDS.includes( this._itemsElements[ itemsIndex ].getID() ) ) {

        this._itemsElements[ itemsIndex ].remove();

        this._itemsElements.splice( itemsIndex, 1 );

        totalFound += 1;

        if ( totalFound >= itemsIDS.length ) foundAll = true;

        itemsIndex -= 1;

      }

      itemsIndex += 1;

    }

  }

  _generateItems() {

    const items = [];

    for ( const item of this._data.items ) {

      const itemElement = new this._itemComponent( item, this._data.itemMethods || {  } );

      this._itemsElements.push( itemElement );

      items.push( itemElement.build() );

    }

    return items;

  }

  _generateElement() {

    if ( this._hasRendered ) return this._element;

    this._searchable = this._data.searchable;

    const header = this._generateHeader();

    this._items = this._generateItems();

    this._body = new DOMElement("div").setClass('list_body').append( ...this._items );

    this._hasRendered = true;

    return new DOMElement("div").setClass('list').append( header, this._body.getElement() ).getElement();

  }

}