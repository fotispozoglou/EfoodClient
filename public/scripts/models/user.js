import { SERVER_URL } from "../config/config.js";
import { GET, POST, PUT } from "../general/request.js";

export const state = {
  preferences: {
    privateName: true,
    privatePhone:	true
  },
  info: {
    name: '',
    phone: '',
    username: ''
  }
};

export const saveUserInfo = async info => {

  const { data, error } = await PUT(`${ SERVER_URL }/info`, { info });

  if ( !error ) {

    return { data };

  }

  return { error };

};

export const getUserInfo = async () => {

  const { data, error } = await GET(`${ SERVER_URL }/info`);

  if ( !error ) { 
   
    state.info.username = data.username;
    state.info.phone = data.phone;
    state.info.name = data.name;

  }

  return { error };

};

export const getUserPreferences = async () => {

  const { data, error } = await GET(`${ SERVER_URL }/preferences`);

  if ( !error ) {

    state.preferences = data.preferences;

    return { data };

  }

  return { error };

};

export const switchPrivacySetting = async ( name, value ) => {

  const { data, error } = await PUT(`${ SERVER_URL }/preferences`, { preference: { name, value } });

};

export const savePassword = async ( currentPassword, newPassword, newPasswordConfirm ) => {

  const { data, error } = await PUT(`${ SERVER_URL }/password`, { currentPassword, newPassword, newPasswordConfirm });

  if ( !error ) return { data };

  return { error };

};

export const deleteUser = async password => {

  const { data, error } = await POST(`${ SERVER_URL }/deleteUser`, { password });

  if ( !error ) return { data };

  return { error };

};