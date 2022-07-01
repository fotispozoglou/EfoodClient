import AuthenticationView from "../../views/authentication/AuthenticationView.js";
import ViewManager from "../../views/ViewManager.js";

export const controlRenderLogin = () => {

  ViewManager.render( AuthenticationView, () => {}, {}, false );
  
  AuthenticationView.show();

};