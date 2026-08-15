import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAM6-psB0ESJHjsZQQfmcNQCneYhlC3BkI",
  authDomain: "uteq-smart-parking-6396c.firebaseapp.com",
  projectId: "uteq-smart-parking-6396c",
  storageBucket: "uteq-smart-parking-6396c.firebasestorage.app",
  messagingSenderId: "146793640780",
  appId: "1:146793640780:web:49ced22746b2e15fa655e9",
  measurementId: "G-TB57SVWK2R",
  databaseURL: "https://uteq-smart-parking-6396c-default-rtdb.firebaseio.com"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar y exportar Realtime Database
export const database = getDatabase(app);