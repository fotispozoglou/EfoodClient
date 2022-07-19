import View, { MAIN } from '../base/View.js';
import DOMElement from '../base/DOMElement.js';
import ListElement from '../base/ListElement.js';
import OrderPreview from './OrderPreview.js';

import EmptyListItem from '../base/EmptyListItem.js';
import { YOU_HAVE_NO_ORDERS } from '../../config/strings.js';

export let ordersBackBtn;

export default new class OrdersView extends View {
  _parent = document.querySelector("#main_center");
  _rerender = false;
  _ordersList;
  id = "orders";
  _onHide;
  _type = MAIN;
  _ordersBackBtn;
  _noItemsItem = new EmptyListItem({ _id: 1, name: YOU_HAVE_NO_ORDERS, icon: 'fa-solid fa-boxes' }, {  }).build();

  addOrder( order ) {

    if ( this._ordersList ) this._ordersList.add( 'pre', order );

  }
  
  updateOrder( orderID, status ) {

    if ( this._ordersList ) this._ordersList.updateItem( orderID, status );

  }

  removeOrder( orderID ) {

    if ( this._ordersList ) this._ordersList.remove( orderID );

  }

  updateList( ...items ) {

    console.log(items);

    this._ordersList.refresh( ...items );

  }

  showOrderStatusError( orderID ) {

    this._ordersList.customModify(function( element ) {

      if ( element.getID() === orderID ) {

        element.showStatusError();

      }

    });

  }

  hideOrderStatusError( orderID ) {

    this._ordersList.customModify(function( element ) {

      if ( element.getID() === orderID ) {

        element.hideStatusError();

      }

    });

  }

  _generateElement() {

    const { orders, onClick } = this._data;

    this._ordersList = new ListElement( orders, OrderPreview, "", "orders_list", { onClick } );

    this._ordersList.setNoItemsItem( this._noItemsItem );

    return new DOMElement("div").append( this._ordersList.build() ).getElement();

  }

  showElements() {  }
  hideElements() {  }

}