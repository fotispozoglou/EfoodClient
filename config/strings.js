const languages = new Map();

languages.set('EN', 0);
languages.set('GR', 1);

module.exports.languages = languages;

module.exports.ACCOUNT = [
  'account',
  'λογαριασμός'
];
module.exports.PRIVACY = [
  'privacy',
  'ιδιωτικότητα'
];
module.exports.SETTINGS = [
  'settings',
  'ρυθμίσεις'
];
module.exports.LOGOUT = [
  'logout',
  'αποσύνδεση'
];
module.exports.ORDER = [
  'order',
  'παράγγειλε'
];
module.exports.CHOOSE_BETWEEN = [
  'choose between',
  'διάλεξε ανάμεσα σε '
];
module.exports.CATEGORIES_OF_PRODUCTS = [
  'categories of products',
  'κατηγωρίες προϊόντων'
];
module.exports.POPULAR_PRODUCTS = [
  'popular products',
  'δημοφιλή προϊόντα'
];

module.exports.WRONG_PASSWORD = [
  'the password is incorrect',
  'ο κωδικός είναι λανθασμένος'
];

module.exports.PASSWORDS_NOT_MATCH = [
  "passwords confirm don't match",
  'οι κωδικοί επιβεβαίωσης δεν ταιριάζουν'
];

module.exports.REGISTERATION_DISABLED = [
  'registration is disabled for this app',
  'η δυνατότητα εγγραφής έχει απενεργοποιηθεί σε αυτή την εφαρμογή'
];

module.exports.strings = new Map([
  ['ACCOUNT', this.ACCOUNT],
  ['PRIVACY', this.PRIVACY],
  ['SETTINGS', this.SETTINGS],
  ['LOGOUT', this.LOGOUT],
  ['ORDER', this.ORDER],
  ['CHOOSE_BETWEEN', this.CHOOSE_BETWEEN],
  ['CATEGORIES_OF_PRODUCTS', this.CATEGORIES_OF_PRODUCTS],
  ['POPULAR_PRODUCTS', this.POPULAR_PRODUCTS]
]);