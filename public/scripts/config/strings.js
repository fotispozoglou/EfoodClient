import { ORDER } from "./statusCodes.js";

export const EN = 0;
export const GR = 1;

let lang = Number(localStorage.getItem('lang'));

if ( lang !== 0 && lang !== 1 ) lang = 0;

export const ACCOUNT = ['account', 'λογαριασμός'][ lang ];
export const PRIVACY = ['privacy', 'ιδιωτικότητα'][ lang ];
export const SETTINGS = ['settings', 'ρυθμίσεις'][ lang ];

export const USERNAME = ['username', 'όνομα χρήστη'][ lang ];
export const NAME = ['name', 'όνομα'][ lang ];
export const SURNAME = ['surname', 'επίθετο'][ lang ];
export const PHONE = ['phone', 'κινητό'][ lang ];

export const PRIVACY_SETTINGS = ['account', 'ρυθμίσεις ιδιωτικότητας'][ lang ];

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

const statusTexts = new Map();

statusTexts.set( ORDER.STATUS_PENDING, { text: STATUS_PENDING } );
statusTexts.set( ORDER.STATUS_ACCEPTED, { text: STATUS_ACCEPTED } );
statusTexts.set( ORDER.STATUS_DELIVERING, { text: STATUS_DELIVERING } );
statusTexts.set( ORDER.STATUS_COMPLETED, { text: STATUS_COMPLETED } );
statusTexts.set( ORDER.STATUS_CANCELED, { text: STATUS_CANCELED } );

export default statusTexts;