import { SERVER_URL } from "../config/config.js";
import { GET, PUT } from "../general/request.js";

export const state = {

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

  if ( !error ) return { data };

  return { error };

};

export const getUserPreferences = async () => {

  const { data, error } = await GET(`${ SERVER_URL }/preferences`);

  if ( !error ) return { data };

  return { error };

};

export const switchPrivacySetting = async ( name, value ) => {

  const { data, error } = await PUT(`${ SERVER_URL }/preferences`, { preference: { name, value } });

};