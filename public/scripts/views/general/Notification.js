import DOMElement from '../base/DOMElement.js';

import { MESSAGE } from '../../config/types.js';

export const DEFAULT_DURATION = 4 * 1000;
export const SHORT = 2 * 1000;
export const LONG = 6 * 1000;

const typesMap = new Map();
typesMap.set( MESSAGE.MESSAGE_SUCCESS, { icon: 'fa-solid fa-check', className: 'success' });
typesMap.set( MESSAGE.MESSAGE_ERROR, { icon: 'fa-solid fa-times', className: 'error' });
typesMap.set( MESSAGE.MESSAGE_INFO, { icon: 'fa-solid fa-info', className: 'info' });
typesMap.set( MESSAGE.MESSAGE_NOTIFY, { icon: 'fa-solid fa-bell', className: 'notify' });

export default class Notification extends DOMElement {
  _text;
  _type;
  _duration;
  _handleNext;
  _progress = 0;
  _progressBar;
  _progressInterval;
  _progressing;
  _closeTimeout;

  constructor({ text, type, duration }, handleNext ) {
    super("div");

    this._text = text;
    this._type = type;
    this._duration = duration;
    this._handleNext = handleNext;

    this.build();

  }

  onClose() {

    clearTimeout( this._closeTimeout );

    this.remove();

    this._handleNext();

  }

  startUpdatingProgressBar() {

    this._progressing = true;

    this._progressInterval = setInterval(() => {

      if ( !this._progressing ) return;

      this._progress += 1;

      this._progressBar.style.width = `${ this._progress }%`;

      if ( this._progress >= 100 ) { 
       
        this._progressing = false;
        
        setTimeout(() => { this.onClose(); }, 250);

      }

    }, this._duration / 100);

  }

  show() {

    document.querySelector("#root").insertAdjacentElement('beforeend', this._element);

    this.startUpdatingProgressBar();

    this._closeTimeout = setTimeout(() => { this.remove(); this._handleNext(); }, this._duration + 200 );

  }

  build() {

    const { icon: typeIcon, className } = typesMap.get( this._type );

    const icon = new DOMElement("i").addClass( `${ typeIcon } ${ className } notification_icon` ).getElement();
    const iconContainer = new DOMElement("div").setClass('notification_icon_container').append( icon ).getElement();

    const messageText = new DOMElement("p").setClass('notification_text').setText( this._text ).getElement();
    const messageTextContainer = new DOMElement("div").setClass('notification_text_container').append( messageText ).getElement();

    this._progress = 0;
    this._progressBar = new DOMElement("div").setClass(`progress_bar ${ className }_notification_progress`).getElement();
    const progressBarContainer = new DOMElement("div").setClass('progress_bar_container').append( this._progressBar ).getElement();

    const body = new DOMElement("div").setClass('notification_body').append( iconContainer, messageTextContainer ).getElement();

    this._element = new DOMElement("div")
      .append( body, progressBarContainer )
      .setClass(`notification ${ className }_notification`)
      .on('click', () => {

        this.onClose();

      })
      .getElement();

    return this._element;

  }

};