import { GENERAL } from "../../config/statusCodes.js";
import { MESSAGE } from "../../config/types.js";
import { controlRenderMessage } from "../../general/messages.js";
import { loginUser, registerUser } from "../../models/authentication.js";
import AuthenticationView from "../../views/authentication/AuthenticationView.js";
import ViewManager from "../../views/ViewManager.js";

export const controlLoginUser = async formElement => {

  const formData = new URLSearchParams();

  for ( const pair of new FormData( formElement ) ) {
  
    formData.append( pair[0], pair[1] );
  
  }

  const { data, error } = await loginUser( formData );

  if ( error || ( data && data.status === GENERAL.ERROR ) ) return controlRenderMessage("error logging in", MESSAGE.MESSAGE_ERROR);

  if ( data.status === GENERAL.SUCCESS ) {

    if ( data.authenticated === true ) return document.location.reload( true );

    AuthenticationView.onError( "this username/password combination don't match a user" );

  }

};

export const controlRegisterUser = async formElement => {

  const formData = new URLSearchParams();

  for ( const pair of new FormData( formElement ) ) {
  
    formData.append( pair[0], pair[1] );
  
  }

  const { data, error } = await registerUser( formData );

  if ( error ) return controlRenderMessage("error registering account", MESSAGE.MESSAGE_ERROR);

  if ( data.status === GENERAL.SUCCESS ) {

    if ( data.registered === true ) return document.location.reload( true );

  }

  AuthenticationView.onError( data.message );

};

export const controlRenderLogin = () => {

  ViewManager.render( AuthenticationView, {
    methods: {
      onLogin: controlLoginUser,
      onRegister: controlRegisterUser
    }
  }, false );
  
  AuthenticationView.show();

};