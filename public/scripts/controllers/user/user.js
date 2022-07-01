import AccountView from "../../views/user/AccountView.js";
import PrivacyView from "../../views/user/PrivacyView.js";
import SettingsView from "../../views/user/SettingsView.js";
import ViewManager, { closeUserMenu, openAccountBtn, openPrivacyBtn, openSettingsBtn, userMenu, userMenuBtn } from "../../views/ViewManager.js";
import * as userModel from '../../models/user.js';
import { addNotification } from "../../models/notifications.js";
import { controlRenderMessage } from "../shop.js";
import { MESSAGE } from "../../config/types.js";
import { LONG, SHORT } from "../../views/general/Notification.js";
import { ACCOUNT_DELETED, ALREADY_ACTIVE_ORDER, ALREADY_ACTIVE_ORDER_DELETE, ERROR_DELETING_USER, ERROR_SAVING_NEW_INFO, ERROR_UPDATING_PASSWORD, PASSWORD_CHANGED_SUCCESSFULLY } from "../../config/strings.js";
import ChangePasswordView from "../../views/user/ChangePasswordView.js";
import { GENERAL, ORDER } from "../../config/statusCodes.js";
import ConfirmActionView from "../../views/general/ConfirmActionView.js";
import View from "../../views/base/View.js";
import SeriousConfirmActionView from "../../views/general/SeriousConfirmActionView.js";

const controlRenderUserSettings = () => {

  ViewManager.render( SettingsView, controlRenderUserSettings, {
    methods: {
      goBack: () => { ViewManager.renderPrevious(); }
    }
  }, true );

};

const controlSwitchPrivacySetting = async ( name, value ) => {

  await userModel.switchPrivacySetting( name, value );

};

const controlRenderUserPrivacy = async () => {

  const { data, error } = await userModel.getUserPreferences();

  ViewManager.render( PrivacyView, controlRenderUserPrivacy, {
    preferences: data.preferences,
    methods: {
      goBack: () => { ViewManager.renderPrevious(); },
      onSwitchSetting: controlSwitchPrivacySetting
    }
  }, true );

};

const controlSaveUserInfo = async info => {

  const { data, error } = await userModel.saveUserInfo( info );

  if ( error ) return controlRenderMessage( ERROR_SAVING_NEW_INFO ,MESSAGE.MESSAGE_ERROR, LONG);

  controlRenderMessage("new information saved", MESSAGE.MESSAGE_SUCCESS, LONG);

};

const controlSavePassword = async ( currentPassword, newPassword, newPasswordConfirm ) => {

  const { data, error } = await userModel.savePassword( currentPassword, newPassword, newPasswordConfirm );

  if ( error || ( data && data.status === GENERAL.ERROR ) ) {

    return controlRenderMessage( ERROR_UPDATING_PASSWORD, MESSAGE.MESSAGE_ERROR );

  }

  controlRenderMessage( PASSWORD_CHANGED_SUCCESSFULLY, MESSAGE.MESSAGE_SUCCESS );

};

const controlRenderChangePassword = async () => {

  ViewManager.render( ChangePasswordView, () => {  }, {
    methods: {
      goBack: () => { ViewManager.renderPrevious(); },
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

const controlRenderDeleteUser = async () => {

  ViewManager.render( SeriousConfirmActionView, () => {}, {
    title: 'delete account',
    confirmText: 'your password',
    onConfirm: controlDeleteUser,
    matchConfirm: false
  }, false);

};

const controlRenderUserAccount = async () => {

  const { data, error } = await userModel.getUserInfo();

  ViewManager.render( AccountView, controlRenderUserAccount, {
    info: data,
    methods: {
      goBack: () => { ViewManager.renderPrevious(); },
      saveUserInfo: controlSaveUserInfo,
      onChangePassword: controlRenderChangePassword,
      onDeleteAccount: controlRenderDeleteUser
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