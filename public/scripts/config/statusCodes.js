export const GENERAL = {
  SUCCESS: 200,
  ERROR: -200,
  NOT_AUTHENTICATED: 400
};

export const PRODUCTS = {
  NOT_FOUND: 300
};

export const ORDER = {
  NOTHING: 97,
  HAS_PENDING_ORDER: 98,
  STATUS_PENDING: 99,
  STATUS_ACCEPTED: 100,
  STATUS_DELIVERING: 101,
  STATUS_COMPLETED: 102,
  NON_COMPLETED: [ 99, 100, 101 ],
  STATUS_CANCELED: -100,
  NOT_FOUND: -101
};

export const AUTHENTICATION = {
  MISSING_USERNAME: "missing_username",
  MISSING_PASSWORD: "missing_password",
  USER_EXISTS: "user_already_exists",
  INVALID_USERNAME_PASSWORD: "password_or_username_incorrect"
};