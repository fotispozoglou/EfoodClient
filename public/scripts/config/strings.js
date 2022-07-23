import { AUTHENTICATION, ORDER } from "./statusCodes.js";

export const languages = new Map();

languages.set('EN', 0);
languages.set('GR', 1);

export const EN = 0;
export const GR = 1;

let lang = languages.get(localStorage.getItem('lang'));

if ( lang !== 0 && lang !== 1 ) lang = 0;

export const ACCOUNT = ['account', 'λογαριασμός'][ lang ];
export const PRIVACY = ['privacy', 'ιδιωτικότητα'][ lang ];
export const SETTINGS = ['settings', 'ρυθμίσεις'][ lang ];

export const USERNAME = ['username', 'όνομα χρήστη'][ lang ];
export const NAME = ['name', 'όνομα'][ lang ];
export const SURNAME = ['surname', 'επίθετο'][ lang ];
export const PHONE = ['phone', 'κινητό'][ lang ];

export const PRIVACY_SETTINGS = ['privacy settings', 'ρυθμίσεις ιδιωτικότητας'][ lang ];

export const VISIBLE_NAME = ['visible name', 'εμφάνιση ονόματος'][ lang ];
export const VISIBLE_PHONE = ['visible phone number', 'εμφάνιση κινητού'][ lang ];

export const LANGUAGE = ['language', 'γλώσσα'][ lang ];

export const STATUS_PENDING = ['waiting to be accepted', 'περίμενε να γίνει αποδεκτή'][ lang ];
export const STATUS_ACCEPTED = ['accepted', 'έγινε αποδεκτή'][ lang ];
export const STATUS_DELIVERING = ['on the way', 'στο δρόμο'][ lang ];
export const STATUS_COMPLETED = ['completed', 'ολοκληρωμένη'][ lang ];
export const STATUS_CANCELED = ['canceled', 'ακυρωμένη'][ lang ];

export const SAVE = ['save', 'αποθήκευση'][ lang ];
export const CHANGE_PASSWORD = ['change password', 'αλλαγή κωδικού'][ lang ];
export const DELETE_ACCOUNT = ['delete account', 'διαγραφή λογαριασμού'][ lang ];

export const COST = ['cost', 'κόστος'][ lang ];
export const ORDER_ACTION = ['order', 'παράγγειλε'][ lang ];

export const ADDRESS = ['address', 'διεύθηνση'][ lang ];
export const FLOOR = ['floor', 'όροφος'][ lang ];
export const COMMENTS = ['comments', 'σχόλια'][ lang ];
export const COMMENTS_LABEL = [
  'instructions for the delivery or anything...', 
  'οδηγίες για το delivery ή οτιδήποτε άλλο'
][ lang ];

export const ORDER_LABEL = ['order', 'παραγγελία'][ lang ];
export const COMPLETE_ORDER = ['complete order', 'ολοκλήρωση'][ lang ];
export const ORDER_STATUS_NOT_ACCURATE = [
  'order status may not be accurate',
  'η κατάσταση της παραγγελείας μπορεί να μην είναι ακριβής'
][ lang ];
export const ORDER_NUMBER = ['order number', 'αριθμός παραγγελίας'][ lang ];

export const PRODUCTS = ['products', 'προϊόντα'][ lang ];

export const TOTAL_PRICE = ['total price', 'συνολική αξία'][ lang ];

export const CATEGORIES = ['categories', 'κατηγωρίες'][ lang ];

export const NO_PRODUCTS_FOUND = ['no products found', 'δεν βρέθηκαν προϊόντα'][ lang ];

export const YOU_HAVE_NO_ORDERS = [
  'you have no orders', 
  'δεν έχετε παραγγελίες'
][ lang ];

export const FILL_CART_WITH_PRODUCTS = [
  'Please fill the cart with products',
  'Προσθέστε προϊόντα στο καλάθι'
][ lang ];

export const ADD = ['add', 'προσθήκη'][ lang ];
export const UPDATE = ['update', 'ενημέρωση'][ lang ];

export const ERROR_REMOVING_PRODUCT = [
  'error removing product',
  'πρόβλημα διαγραφής προϊόντος'
][lang];

export const ERROR_UPDATING_PRODUCT = [
  'error updating product',
  'πρόβλημα ενημέρωσης προϊόντος'
][ lang ];

export const ERROR_CALCULATING_TOTAL = [
  'error calculating new total',
  'πρόβλημα υπολογισμού συνολικού ποσού'
][lang];

export const ERROR_UPDATING_QUANTITY = [
  'error updating quantity',
  'πρόβλημα ενημέρωσης ποσότητας'
][lang];

export const ERROR_LOADING_CART = [
  'error loading cart',
  'πρόβλημα φόρτωσης καλαθιού'
][lang];

export const ERROR_ADDING_RPODUCT = [
  'error adding product',
  'πρόβλημα προσθήκης προϊόντος'
][lang];

export const ORDER_TOTAL_NOT_ACCURATE = [
  'order total may not be accurate',
  'το συνολικό ποσό μπορεί να μην είναι ακριβές'
][lang];

export const ERROR_LOADING_PRODUCT = [
  'error loading product',
  'πρόβλημα φόρτωσης προϊόντος'
][lang];

export const ERROR_MAKING_ORDER = [
  'error making order',
  'πρόβλημα δημηουργίας παραγγελίας'
][lang];

export const ALREADY_ACTIVE_ORDER = [
  'you already have an active order',
  'έχεις ήδη μια παραγγελία'
][lang];

export const NEED_TO_LOGIN = [
  'you need to login first',
  'πρέπει να συνδεθείτε πρώτα'
][ lang ];

export const LOGIN = [
  'login',
  'σύνδεση'
][ lang ];

export const REGISTER = [
  'register',
  'εγγραφή'
][ lang ];

export const ALREAD_HAVE_ACCOUNT = [
  'i have an account',
  'έχω λογαριασμό'
][ lang ];

export const DONT_HAVE_ACCOUNT = [
  "i don't have an account",
  'δεν έχω λογαριασμό'
][ lang ];

export const ERROR_LOADING_ORDER = [
  'error loading order',
  'πρόβλημα φόρτωσης παραγγελίας'
][lang];

export const ERROR_LOADING_ORDERS = [
  'error loading orders',
  'πρόβλημα φόρτωσης παραγγελιών'
][lang];

export const ERROR_SAVING_NEW_INFO = [
  'error saving new information',
  'πρόβλημα αποθήκευσης καινούργιων ρυθμήσεων'
][lang];

export const ERROR_UPDATING_PASSWORD = [
  'error updating password', 
  'πρόβλημα αποθήκευσης κωδικού'
][ lang ];

export const PASSWORD_CHANGED_SUCCESSFULLY = [
  'password changed successfully',
  'ο κωδικός αποθηκεύτηκε'
][ lang ];

export const ERROR_DELETING_USER = [
  'error deleting user',
  'πρόβλημα διαγραφής χρήστη'
][ lang ];

export const ACCOUNT_DELETED = [
  'account deleted',
  'ο λογιαριασμός διαγράφτηκε'
][ lang ];

export const ALREADY_ACTIVE_ORDER_DELETE = [
  `can't delete account. Υou have an active order`,
  'δεν μπορείτε να διαγράψεται λογαριασμό. Έχετε μη ολοκληρωμένη παραγγελία'
][ lang ];

export const NEED_TO_SIGNIN = [
  'you need to log in',
  'πρέπει να συνδεθείτε'
][ lang ];

export const USER_EXISTS = [
  'username already exists',
  'αυτό το όνομα χρήστη χρησημοποιήται'
][ lang ];

export const MISSING_USERNAME = [
  'fill the username',
  'συμπληρώστε το όνομα χρήστη'
][ lang ];

export const MISSING_PASSWORD = [
  'fill the password',
  'συμπληρώστε τον κωδικό πρόσβασης'
][ lang ];

export const ERROR_CHANGING_LANGUAGE = [
  'error changing language',
  'πρόβλημα αλλαγής γλώσσας'
][ lang ];

const statusTexts = new Map();

statusTexts.set( ORDER.STATUS_PENDING, { text: STATUS_PENDING } );
statusTexts.set( ORDER.STATUS_ACCEPTED, { text: STATUS_ACCEPTED } );
statusTexts.set( ORDER.STATUS_DELIVERING, { text: STATUS_DELIVERING } );
statusTexts.set( ORDER.STATUS_COMPLETED, { text: STATUS_COMPLETED } );
statusTexts.set( ORDER.STATUS_CANCELED, { text: STATUS_CANCELED } );

export const authenticationErrors = new Map();

authenticationErrors.set( AUTHENTICATION.USER_EXISTS, USER_EXISTS );
authenticationErrors.set( AUTHENTICATION.MISSING_USERNAME, MISSING_USERNAME );
authenticationErrors.set( AUTHENTICATION.MISSING_PASSWORD, MISSING_PASSWORD );

export const classes = {
  ICONS: {
    TRASH: "icon fa-trash",
    SEARCH: "icon fa-search",
    PLUS_SQUARE: "icon fa-plus-square",
    SQUARE: "icon reg-icon fa-square",
    CHECKED_SQUARE: "icon fa-check-square",
    ANGLE_DOWN: "icon fa-angle-down",
    ANGLE_RIGHT: "icon fa-angle-right",
    MINUS: "icon fa-minus",
    PLUS: "icon fa-plus",
    CHECK_CIRCLE: "icon fa-check-circle",
    SHIELD: "icon fa-shield-halved",
    USER_SHIELD: "icon fa-user-shield",
    LIST_CHECK: "icon fa-check-to-slot",
    TIMES: "icon fa-times",
    ROTATE: "icon fa-rotate",
    CIRCLE: "icon fa-circle",
    WARNING: "icon fa-triangle-exclamation",
    POINTER: "icon fa-hand-pointer",
    ORDERS: "fa-solid fa-boxes-stacked"
  }
};

export default statusTexts;