import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const environmentConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseConfigured = Object.values(environmentConfig).every(
  (value) => Boolean(value) && !value.startsWith('your-'),
)

// Keep the UI usable before real Firebase credentials are added. Firebase services
// are initialized with harmless local values, but all network-backed code is gated
// by firebaseConfigured elsewhere in the app.
const config = {
  apiKey: environmentConfig.apiKey || 'local-development-key',
  authDomain: environmentConfig.authDomain || 'badgekart-local.firebaseapp.com',
  projectId: environmentConfig.projectId || 'badgekart-local',
  storageBucket: environmentConfig.storageBucket || 'badgekart-local.appspot.com',
  messagingSenderId: environmentConfig.messagingSenderId || '000000000000',
  appId: environmentConfig.appId || '1:000000000000:web:badgekartlocal',
}

const app = initializeApp(config)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
