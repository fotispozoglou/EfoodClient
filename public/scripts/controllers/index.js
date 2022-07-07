import AuthenticationView from "../views/authentication/AuthenticationView.js";

export const openAuthenticationBtn = document.querySelector("#login_navigation_btn");

import { controlLoginUser, controlRegisterUser } from '../controllers/authentication/authentication.js';

AuthenticationView.render({
  methods: {
    onLogin: controlLoginUser,
    onRegister: controlRegisterUser
  }
});

const authBackground = document.querySelector("#authentication_background");

authBackground.classList.add('hidden');

if ( openAuthenticationBtn ) {

  openAuthenticationBtn.addEventListener('click', () => {

    authBackground.classList.remove('hidden');
  
  });

}
