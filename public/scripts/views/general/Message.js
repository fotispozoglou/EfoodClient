import { MESSAGE } from "../../config/types.js";
import DOMElement from "../base/DOMElement.js";

const typesMap = new Map();
typesMap.set( MESSAGE.MESSAGE_SUCCESS, { icon: 'fa-solid fa-check', className: 'success' });
typesMap.set( MESSAGE.MESSAGE_ERROR, { icon: 'fa-solid fa-exclamation', className: 'error' });
typesMap.set( MESSAGE.MESSAGE_INFO, { icon: 'fa-solid fa-info', className: 'info' });
typesMap.set( MESSAGE.MESSAGE_NOTIFY, { icon: 'fa-solid fa-bell', className: 'notify' });

export default class Message extends DOMElement {
  _text;
  _duration;
  _type;
  _onClose;
  _progress = 0;
  _progressing = false;
  _progressBar;
  _progressInterval;
  _parent = document.querySelector("#root");

  constructor({ text, duration, type, onClose }) {
    super("div");

    this._text = text;
    this._duration = duration;
    this._type = type;
    this._onClose = onClose;

  }

  render() {

    const { icon: typeIcon, className } = typesMap.get( this._type );

    const icon = new DOMElement("i").setClass( `${typeIcon} message_icon` ).getElement();
    const iconContainer = new DOMElement("div").setClass('message_icon_container').append( icon ).getElement();

    const messageText = new DOMElement("p").setClass('message_text').setText( this._text ).getElement();
    const messageTextContainer = new DOMElement("div").setClass('message_text_container').append( messageText ).getElement();

    this._progress = 0;
    this._progressBar = new DOMElement("div").setClass(`progress_bar ${ className }_message_progress`).getElement();
    const progressBarContainer = new DOMElement("div").setClass('progress_bar_container').append( this._progressBar ).getElement();

    const body = new DOMElement("div").setClass('message_body').append( iconContainer, messageTextContainer ).getElement();

    this._element = new DOMElement("div")
      .append( body, progressBarContainer )
      .setClass(`message ${ className }_message`)
      .on('click', () => {

        this._onClose();

      })
      .getElement();

    this._parent.insertAdjacentElement( 'beforeend', this._element );

    this.startUpdatingProgressBar();

  }

  startUpdatingProgressBar() {

    this._progressing = true;

    this._progressInterval = setInterval(() => {

      if ( !this._progressing ) return;

      this._progress += 1;

      this._progressBar.style.width = `${ this._progress }%`;

      if ( this._progress >= 100 ) { 
       
        this._progressing = false;
        
        setTimeout(() => { this._onClose(); }, 200);

      }

    }, ( this._duration / ( 100) ) * 1000);

  }

  remove() {

    clearInterval( this._progressInterval );

    this._element.remove();

    delete this;

  }

};