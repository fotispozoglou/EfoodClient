import AccountView from "../../views/user/AccountView.js";
import PrivacyView from "../../views/user/PrivacyView.js";
import SettingsView from "../../views/user/SettingsView.js";
import ViewManager, { closeUserMenu, openAccountBtn, openPrivacyBtn, openSettingsBtn, userMenu, userMenuBtn } from "../../views/ViewManager.js";

const controlRenderUserSettings = () => {

  ViewManager.render( SettingsView, controlRenderUserSettings, {}, true );

};

const controlRenderUserPrivacy = () => {

  ViewManager.render( PrivacyView, controlRenderUserPrivacy, {}, true );

};

const controlRenderUserAccount = () => {

  ViewManager.render( AccountView, controlRenderUserAccount, {
    methods: {
      goBack: () => { ViewManager.renderPrevious(); }
    }
  }, true );

};

const initializeListeners = () => {

  openAccountBtn.addEventListener('click', controlRenderUserAccount);

  openPrivacyBtn.addEventListener('click', controlRenderUserPrivacy);

  openSettingsBtn.addEventListener('click', controlRenderUserSettings);

  userMenuBtn.addEventListener('click', () => {

    closeUserMenu.classList.remove('hidden');
    userMenu.classList.remove('hidden');

  });

  closeUserMenu.addEventListener('click', e => {

    e.stopPropagation();

    closeUserMenu.classList.add('hidden');
    userMenu.classList.add('hidden');

  });

  userMenu.addEventListener('click', () => {

    closeUserMenu.classList.add('hidden');
    userMenu.classList.add('hidden');

  });

};

export const initUser = () => {

  initializeListeners();

};