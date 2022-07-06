import { POST, POST_FORM } from "../general/request.js";

export const loginUser = async formData => {

  const { data, error } = await POST_FORM("/login", formData);

  if ( !error ) return { data };

  return { error };

};