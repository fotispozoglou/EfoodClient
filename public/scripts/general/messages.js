import { DEFAULT_DURATION } from '../views/general/Notification.js';
import { addNotification } from '../models/notifications.js';

export const controlRenderMessage = ( message, type, duration = DEFAULT_DURATION ) => {

  addNotification({ text: message, type, duration });

};