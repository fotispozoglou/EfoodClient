import { GENERAL } from "../../config/statusCodes.js";
import { MESSAGE } from "../../config/types.js";
import { loginUser } from "../../models/authentication.js";
import AuthenticationView from "../../views/authentication/AuthenticationView.js";
import ViewManager from "../../views/ViewManager.js";
import { controlRenderMessage } from "../shop.js";

const controlLoginUser = async formElement => {

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

export const controlRenderLogin = () => {

  ViewManager.render( AuthenticationView, () => {}, {
    methods: {
      onLogin: controlLoginUser
    }
  }, false );
  
  AuthenticationView.show();

};