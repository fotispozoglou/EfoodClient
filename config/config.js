module.exports.IS_PRODUCTION = process.env.NODE_ENV === "production";
module.exports.SERVER_URL = this.IS_PRODUCTION
  ? `https://efood-client.herokuapp.com`
  : process.env.DEV_CLIENT_DOMAIN;
module.exports.API_URL = this.IS_PRODUCTION
  ? `https://efoodapi.herokuapp.com`
  : process.env.DEV_API_DOMAIN;
