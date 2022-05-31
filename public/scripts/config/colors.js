import { ORDER } from "./statusCodes.js";

const statusColors = new Map();

statusColors.set( ORDER.NOTHING, { backgroundColor: '', color: '#464646' } );
statusColors.set( ORDER.STATUS_PENDING, { backgroundColor: 'rgb(255, 189, 86)', color: "#000" } );
statusColors.set( ORDER.STATUS_ACCEPTED, { backgroundColor: 'rgb(17, 237, 155)', color: "white" } );
statusColors.set( ORDER.STATUS_DELIVERING, { backgroundColor: 'rgb(101, 196, 253)', color: "#000" } );
statusColors.set( ORDER.STATUS_COMPLETED, { backgroundColor: 'rgb(107, 110, 244)', color: "white" } );
statusColors.set( ORDER.STATUS_CANCELED, { backgroundColor: 'rgb(251, 81, 81)', color: "white" } );

export default statusColors;