import ErrorView from "../views/ErrorView.js";
let API_TOKEN = null;
let TOKEN = null;
let isLoggedIn = false;

export const isAuthenticated = async () => {

  return await POST('/authenticated');

};

export const setAPIToken = ( key, key2, loggedIn ) => {

  API_TOKEN = key;
  isLoggedIn = loggedIn;
  TOKEN = key2;

};

const getCookie = name => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

let hasInternet = true;
let hasInternetError = false;

const handleNoConnection = () => {

  hasInternetError = true;

  ErrorView.render({ text: 'you are not connected' });

};

const handleHideError = () => {

  ErrorView.hide();

};

const getRequestOptions = async ( method, body = {}) => {

  if ( !navigator.onLine ) {

    handleNoConnection();

    return { error: Error("No Internet") };

  };

  if ( hasInternetError ) handleHideError();

  hasInternetError = false;

  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${ TOKEN }`,
      'Content-type': 'application/json',
      'CSRF-Token': API_TOKEN
    }
  }

  if ( method !== "GET" ) options.body = JSON.stringify( body );

  return { options };

};

export const GET = async url => {

  const { options, error } = await getRequestOptions('GET');

  if ( error ) return { error: Error("Cannot Get Options") };

  return await fetch( url, options )
    .then(response => {

      if ( response.status === 200 ) return response.json();

      throw new Error( response.status );

    })
    .then(data => {

      return { data };

    })
    .catch(error => { return { error }; });

};

export const POST = async ( url, body ) => {

  const { options, error } = await getRequestOptions('POST', body);

  if ( error ) return { error: Error("Cannot Get Options") };

  return await fetch( url, options )
    .then(response => {

      if ( response.status === 200 ) return response.json();

      throw new Error( response.status );

    })
    .then(data => {

      return { data };

    })
    .catch(error => { return { error }; });

};

export const PUT = async ( url, body ) => {

  const { options, error } = await getRequestOptions('PUT', body);

  console.log( options );

  if ( error ) return { error: Error("Cannot Get Options") };

  return await fetch( url, options )
    .then(response => {

      if ( response.status === 200 ) return response.json();

      throw new Error( response.status );

    })
    .then(data => {

      return { data };

    })
    .catch(error => { return { error }; });

};

export const DELETE = async ( url, body ) => {

  const { options, error } = await getRequestOptions('DELETE', body);

  console.log( options );

  if ( error ) return { error: Error("Cannot Get Options") };

  return await fetch( url, options )
    .then(response => {

      if ( response.status === 200 ) return response.json();

      throw new Error( response.status );

    })
    .then(data => {

      return { data };

    })
    .catch(error => { return { error }; });

};

export const POST_FORM = async ( url, formData ) => {

  return await fetch(url, {
    method: 'POST',
    body: formData
  })
  .then(response => {

    if ( response.status === 200 ) return response.json();

    throw new Error( response.status );

  })
  .then(data => {

    return { data };

  })
  .catch(error => { return { error }; });

}