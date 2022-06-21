import View from '../base/View.js';
import DOMElement from '../base/DOMElement.js';
import ListElement from '../base/ListElement.js';
import OrderPreview from './OrderPreview.js';

import EmptyListItem from '../base/EmptyListItem.js';

export const ordersBackBtn = document.querySelector("#orders_back_btn");
const showOrdersBtn = document.querySelector("#open_orders_btn");

export default new class OrdersView extends View {
  _parent = document.querySelector("#main_center");
  _rerender = false;
  _ordersList;
  id = "orders";
  _onHide;
  _noItemsItem = new EmptyListItem({ _id: 1, name: 'You have no orders', icon: 'fa-solid fa-boxes' }, {  }).build();

  addOrder( order ) {

    this._ordersList.add( 'pre', order );

  }
  
  updateOrder( orderID, status ) {

    this._ordersList.updateItem( orderID, status );

  }

  removeOrder( orderID ) {

    this._ordersList.remove( orderID );

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

    this._ordersList = new ListElement( orders, OrderPreview, "", "", { onClick } );

    this._ordersList.setNoItemsItem( this._noItemsItem );

    return new DOMElement("div").setID('orders_list').append( this._ordersList.build() ).getElement();

  }

  showElements() { showOrdersBtn.style.color= "#464646"; ordersBackBtn.classList.remove('hidden'); }
  hideElements() { ordersBackBtn.classList.add('hidden'); }

}