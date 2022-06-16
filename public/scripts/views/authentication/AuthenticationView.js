import DOMElement from '../base/DOMElement.js';
import View, { WINDOW } from '../base/View.js';
import InputElement from '../general/inputs/InputElement.js';

const authenticationBackBtn = document.querySelector("#authentication_back_btn");

export default new class AuthenticationView extends View {
  _parent = document.querySelector("#main");
  _rerender = true;
  _loginElement;
  _registerElement;
  _type = WINDOW;
  id = "authentication_background";

  showElements() {  }

  generateLogin() {

    const username = new InputElement("username", "fotis", () => {  }, false).setName('username').getElement();

    const password = new InputElement("password", "password", () => {  }, false).setName('password').setType('password').getElement();

    const loginBtn = new DOMElement("button").setText('login').setClass('authentication_btn').setID("login_btn").getElement();

    const renderRegisterBtn = new DOMElement("button")
      .setText('I dont have an account')
      .setClass('authentication_info_btn')
      .on('click', () => { this.renderRegister(); })
      .getElement();

    const loginForm = new DOMElement("form")
      .attributes(['action', '/login'], ['method', 'POST'])
      .append( username, password, loginBtn )
      .setID("login_form")
      .getElement();

    this._loginElement = new DOMElement("div").setID("authentication_login").append( loginForm, renderRegisterBtn ).getElement();

  }

  generateRegister() {

    const username = new InputElement("username", "fotis", () => {  }, false).setName('username').getElement();

    const password = new InputElement("password", "password", () => {  }, false).setName('password').setType('password').getElement();

    const registerBtn = new DOMElement("button").setText('register').setClass('authentication_btn').setID("register_btn").getElement();

    const renderLoginBtn = new DOMElement("button")
      .setText('I have an account')
      .setClass('authentication_info_btn')
      .on('click', () => { this.renderLogin(); })
      .getElement();

    const registerForm = new DOMElement("form")
      .attributes(['action', '/register'], ['method', 'POST'])
      .append( username, password, registerBtn )
      .setID("register_form")
      .getElement();

    this._registerElement = new DOMElement("div").setID("authentication_register").append( registerForm, renderLoginBtn ).getElement();

  }

  renderLogin() { this._body.empty(); this._body.append( this._loginElement ); }

  renderRegister() { this._body.empty(); this._body.append( this._registerElement ); }

  _generateElement() {

    this.generateLogin();
    this.generateRegister();

    const backBtn = new DOMElement("i").setID("authentication_back_btn").setClass('fa-solid fa-arrow-left').getElement();

    backBtn.addEventListener('click', () => {

      this._element.classList.add('hidden');

    });

    const headerBackContainer = new DOMElement("div").setID("authentication_navigation_header").append( backBtn ).getElement();

    this._header = new DOMElement("div").setID("authentication_header").append( headerBackContainer ).getElement();

    this._body = new DOMElement("div").setID("authentication_body").append( this._loginElement );

    const element = new DOMElement("div").setID("authentication").append( this._header, this._body.getElement() ).getElement();

    this._element = new DOMElement("div").append( element ).getElement();

    return this._element;

  }

};