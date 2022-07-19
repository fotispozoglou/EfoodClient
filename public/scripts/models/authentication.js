import { POST_FORM } from "../general/request.js";

export const registerUser = async formData => {

  const { data, error } = await POST_FORM("/register", formData);

  if ( !error ) return { data };

  return { error };

};

export const loginUser = async formData => {

  const { data, error } = await POST_FORM("/login", formData);

  if ( !error ) return { data };

  return { error };

};