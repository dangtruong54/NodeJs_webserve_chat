import admin from 'firebase-admin';
import dotenv from 'dotenv'
dotenv.config()

let serviceAccount = require('../config/live-llc-test-35693ff4bfe9.json');

let firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
});

export default firebfirebase.initializeAppase;
