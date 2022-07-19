import AccountView from "../../views/user/AccountView.js";
import PrivacyView from "../../views/user/PrivacyView.js";
import SettingsView from "../../views/user/SettingsView.js";
import ViewManager, { closeUserMenu, userMenu, userMenuBtn } from "../../views/ViewManager.js";
import * as userModel from '../../models/user.js';
import { controlRenderMessage } from "../../general/messages.js";
import { MESSAGE } from "../../config/types.js";
import { LONG, SHORT } from "../../views/general/Notification.js";
import { ACCOUNT_DELETED, ALREADY_ACTIVE_ORDER_DELETE, ERROR_CHANGING_LANGUAGE, ERROR_DELETING_USER, ERROR_SAVING_NEW_INFO, ERROR_UPDATING_PASSWORD, PASSWORD_CHANGED_SUCCESSFULLY } from "../../config/strings.js";
import ChangePasswordView from "../../views/user/ChangePasswordView.js";
import { GENERAL, ORDER } from "../../config/statusCodes.js";
import SeriousConfirmActionView from "../../views/general/SeriousConfirmActionView.js";
import { shopRouter } from "../shop.js";
// import Router from "../Router.js";
// import { shopRouter } from "../shop.js";

const controlChangeLanguage = async language => {

  const { data, error } = await userModel.updateUserLanguage( language );

  if ( error ) return controlRenderMessage( ERROR_CHANGING_LANGUAGE, MESSAGE.MESSAGE_ERROR, 99999 );

  localStorage.setItem('lang', language);

  document.location.reload( true );

};

export const controlRenderUserSettings = () => {

  ViewManager.render( SettingsView, {
    methods: {
      goBack: () => {  },
      onChangeLanguage: controlChangeLanguage
    }
  }, true );

};

const controlSwitchPrivacySetting = async ( name, value ) => {

  await userModel.switchPrivacySetting( name, value );

};

export const controlRenderUserPrivacy = async () => {

  const { data, error } = await userModel.getUserPreferences();

  ViewManager.render( PrivacyView, {
    preferences: userModel.state.preferences.privacy, 
    methods: {
      goBack: () => { shopRouter.back() },
      onSwitchSetting: controlSwitchPrivacySetting
    }
  }, true );

};

const controlSaveUserInfo = async info => {

  const { data, error } = await userModel.saveUserInfo( info );

  if ( error ) return controlRenderMessage( ERROR_SAVING_NEW_INFO ,MESSAGE.MESSAGE_ERROR, LONG);

  controlRenderMessage("new information saved", MESSAGE.MESSAGE_SUCCESS );

};

const controlSavePassword = async ( currentPassword, newPassword, newPasswordConfirm ) => {

  const { data, error } = await userModel.savePassword( currentPassword, newPassword, newPasswordConfirm );

  if ( error || ( data && data.status === GENERAL.ERROR ) ) {

    return controlRenderMessage( ERROR_UPDATING_PASSWORD, MESSAGE.MESSAGE_ERROR );

  }

  controlRenderMessage( PASSWORD_CHANGED_SUCCESSFULLY, MESSAGE.MESSAGE_SUCCESS );

};

export const controlRenderChangePassword = async () => {

  ViewManager.render( ChangePasswordView, {
    methods: {
      goBack: () => { shopRouter.back(); },
      savePassword: controlSavePassword
    }
  }, false);

};

const controlDeleteUser = async password => {

  const { data, error } = await userModel.deleteUser( password );

  if ( error ) {

    return controlRenderMessage( ERROR_DELETING_USER, MESSAGE.MESSAGE_ERROR, LONG );

  }

  if ( data.status === GENERAL.ERROR ) return controlRenderMessage( ERROR_DELETING_USER, MESSAGE.MESSAGE_ERROR, LONG );

  if ( data.deleteStatus && data.deleteStatus === ORDER.HAS_PENDING_ORDER ) return controlRenderMessage( ALREADY_ACTIVE_ORDER_DELETE, MESSAGE.MESSAGE_ERROR, LONG );

  controlRenderMessage( ACCOUNT_DELETED, MESSAGE.MESSAGE_SUCCESS, SHORT );

  setTimeout(() => {

    document.location = '/logout';

  }, SHORT );

};

export const controlRenderDeleteUser = async () => {

  SeriousConfirmActionView.render({
    title: 'delete account',
    informationText: 'your password',
    confirmText: 'delete',
    inputType: 'password',
    onConfirm: controlDeleteUser,
    matchConfirm: false,
    goBack: () => { shopRouter.back(); SeriousConfirmActionView.remove(); }
  });

};

export const controlRenderUserAccount = async () => {

  const { data, error } = await userModel.getUserInfo();

  ViewManager.render( AccountView, {
    info: userModel.state.info,
    methods: {
      goBack: () => { shopRouter.back(); },
      saveUserInfo: controlSaveUserInfo,
      onChangePassword: controlRenderChangePassword,
      onDeleteAccount: controlRenderDeleteUser
    }
  }, true );

};

const initializeListeners = () => {

  // openAccountBtn.addEventListener('click', controlRenderUserAccount);

  // openPrivacyBtn.addEventListener('click', controlRenderUserPrivacy);

  // openSettingsBtn.addEventListener('click', controlRenderUserSettings);

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