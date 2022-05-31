import { ORDER } from "./statusCodes.js";

const statusTexts = new Map();

statusTexts.set( ORDER.STATUS_PENDING, { text: "waiting to be accepted" } );
statusTexts.set( ORDER.STATUS_ACCEPTED, { text: "accepted" } );
statusTexts.set( ORDER.STATUS_DELIVERING, { text: "on the way" } );
statusTexts.set( ORDER.STATUS_COMPLETED, { text: "completed" } );
statusTexts.set( ORDER.STATUS_CANCELED, { text: "canceled" } );

export default statusTexts;