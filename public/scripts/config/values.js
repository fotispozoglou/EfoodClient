import { ORDER } from "./statusCodes.js";

export const ordersInterval = new Map();

ordersInterval.set( ORDER.STATUS_PENDING, 15 );
ordersInterval.set( ORDER.STATUS_ACCEPTED, 60 );
ordersInterval.set( ORDER.STATUS_DELIVERING, 45 );
