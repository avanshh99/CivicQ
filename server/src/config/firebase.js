import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// In a real production app, you would use a service account key JSON file
// For this setup, we'll initialize it safely so it doesn't crash if the key isn't present
try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase Admin initialized');
  } else {
    console.log('⚠️ Firebase Admin missing credentials, skipping initialization');
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
}

export const db = admin.apps.length ? admin.firestore() : null;
export const auth = admin.apps.length ? admin.auth() : null;
