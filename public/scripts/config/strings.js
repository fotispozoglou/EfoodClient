import { ORDER } from "./statusCodes.js";

export const EN = 0;
export const GR = 1;

let lang = localStorage.getItem('lang');

if ( lang !== 0 || lang !== 1 ) lang = 0;

export const STATUS_PENDING_TEXT = ['waiting to be accepted', 'περίμενε να γίνει αποδεκτή'][ lang ];
export const STATUS_ACCEPTED_TEXT = ['accepted', 'έγινε αποδεκτή'][ lang ];
export const STATUS_DELIVERING_TEXT = ['on the way', 'στο δρόμο'][ lang ];
export const STATUS_COMPLETED_TEXT = ['completed', 'ολοκληρωμένη'][ lang ];
export const STATUS_CANCELED_TEXT = ['canceled', 'ακυρωμένη'][ lang ];

const statusTexts = new Map();

statusTexts.set( ORDER.STATUS_PENDING, { text: STATUS_PENDING_TEXT } );
statusTexts.set( ORDER.STATUS_ACCEPTED, { text: STATUS_ACCEPTED_TEXT } );
statusTexts.set( ORDER.STATUS_DELIVERING, { text: STATUS_DELIVERING_TEXT } );
statusTexts.set( ORDER.STATUS_COMPLETED, { text: STATUS_COMPLETED_TEXT } );
statusTexts.set( ORDER.STATUS_CANCELED, { text: STATUS_CANCELED_TEXT } );

export default statusTexts;