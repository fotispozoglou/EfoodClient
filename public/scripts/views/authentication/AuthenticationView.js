import { authenticationErrors } from '../../config/strings.js';
import { POST, POST_FORM } from '../../general/request.js';
import DOMElement from '../base/DOMElement.js';
import View, { WINDOW } from '../base/View.js';
import InputElement from '../general/inputs/InputElement.js';
import PasswordInput from '../general/inputs/PasswordInput.js';

const authenticationBackBtn = document.querySelector("#authentication_back_btn");

export default new class AuthenticationView extends View {
  _parent = document.querySelector("#main");
  _rerender = true;
  _loginElement;
  _registerElement;
  _type = WINDOW;
  _errorText;
  id = "authentication_background";

  showElements() {  }

  onError( error ) {

    console.log(error);

    if ( authenticationErrors.has( error ) ) {

      return this._errorText.textContent = authenticationErrors.get( error );

    }

    this._errorText.textContent = error;

  }

  generateLogin() {

    const { onLogin } = this._data.methods;

    const loginForm = new DOMElement("form")
      .attributes(['action', '/login'], ['method', 'POST'])
      .setID("login_form")
      .on('submit', async e => {

        e.preventDefault();

        onLogin( loginForm.getElement() );

      })

    const username = new InputElement("username", "fotis", () => {  }, false).setName('username');

    const password = new PasswordInput("password", "password", () => {  }, false).setName('password').setType('password');

    const loginBtn = new DOMElement("button")
      .setText('login')
      .setClass('authentication_btn')
      .setID("login_btn")
      .getElement();

    const renderRegisterBtn = new DOMElement("button")
      .setText('I dont have an account')
      .setClass('authentication_info_btn cancel_btn')
      .on('click', () => { this.renderRegister(); })
      .getElement();

    loginForm.append( username.getElement(), password.getElement(), loginBtn );

    this._loginElement = new DOMElement("div").setID("authentication_login").append( loginForm.getElement(), renderRegisterBtn ).getElement();

  }

  generateRegister() {

    const { onRegister } = this._data.methods;

    const registerForm = new DOMElement("form")
      .attributes(['action', '/register'], ['method', 'POST'])
      .setID("register_form")
      .on('submit', async e => {

        e.preventDefault();

        onRegister( registerForm.getElement() );

      })

    const username = new InputElement("username", "fotis", () => {  }, false).setName('username').getElement();

    const password = new PasswordInput("password", "password", () => {  }, false).setName('password').setType('password').getElement();

    const registerBtn = new DOMElement("button").setText('register').setClass('authentication_btn').setID("register_btn").getElement();

    registerForm.append( username, password, registerBtn );

    const renderLoginBtn = new DOMElement("button")
      .setText('I have an account')
      .setClass('authentication_info_btn cancel_btn')
      .on('click', () => { this.renderLogin(); })
      .getElement();

    this._registerElement = new DOMElement("div").setID("authentication_register").append( registerForm.getElement(), renderLoginBtn ).getElement();

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

    this._errorText = new DOMElement("p").setText("").setID("authentication_header_error").getElement();

    this._header = new DOMElement("div").setID("authentication_header").append( headerBackContainer, this._errorText ).getElement();

    this._body = new DOMElement("div").setID("authentication_body").append( this._loginElement );

    const element = new DOMElement("div").setID("authentication").append( this._header, this._body.getElement() ).getElement();

    this._element = new DOMElement("div").append( element ).getElement();

    return this._element;

  }

};