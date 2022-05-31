import { schemas } from '../config/database.js';

export const db = new Dexie('Efood');

window.testdb = db;

db.version(1).stores( schemas );

db.open();

export const generateID = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}