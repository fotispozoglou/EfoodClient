import AccountView from "../../views/user/AccountView.js";
import PrivacyView from "../../views/user/PrivacyView.js";
import SettingsView from "../../views/user/SettingsView.js";
import ViewManager, { closeUserMenu, openAccountBtn, openPrivacyBtn, openSettingsBtn, userMenu, userMenuBtn } from "../../views/ViewManager.js";
import * as userModel from '../../models/user.js';
import { addNotification } from "../../models/notifications.js";
import { controlRenderMessage } from "../shop.js";
import { MESSAGE } from "../../config/types.js";
import { LONG } from "../../views/general/Notification.js";
import { ERROR_SAVING_NEW_INFO } from "../../config/strings.js";

const controlRenderUserSettings = () => {

  ViewManager.render( SettingsView, controlRenderUserSettings, {}, true );

};

const controlSwitchPrivacySetting = async ( name, value ) => {

  await userModel.switchPrivacySetting( name, value );

};

const controlRenderUserPrivacy = async () => {

  const { data, error } = await userModel.getUserPreferences();

  ViewManager.render( PrivacyView, controlRenderUserPrivacy, {
    preferences: data.preferences,
    methods: {
      onSwitchSetting: controlSwitchPrivacySetting
    }
  }, true );

};

const controlSaveUserInfo = async info => {

  const { data, error } = await userModel.saveUserInfo( info );

  if ( error ) return controlRenderMessage( ERROR_SAVING_NEW_INFO , MESSAGE.MESSAGE_ERROR, LONG);

  controlRenderMessage("new information saved", MESSAGE.MESSAGE_SUCCESS, LONG);

};

const controlRenderUserAccount = async () => {

  const { data, error } = await userModel.getUserInfo();

  ViewManager.render( AccountView, controlRenderUserAccount, {
    info: data,
    methods: {
      goBack: () => { ViewManager.renderPrevious(); },
      saveUserInfo: controlSaveUserInfo
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