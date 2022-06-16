import AuthenticationView from "../views/authentication/AuthenticationView.js";

export const openAuthenticationBtn = document.querySelector("#login_navigation_btn");

AuthenticationView.render({});

const authBackground = document.querySelector("#authentication_background");

authBackground.classList.add('hidden');

openAuthenticationBtn.addEventListener('click', () => {

  authBackground.classList.remove('hidden');

});
