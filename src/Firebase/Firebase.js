import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
 apiKey: "AIzaSyDVaFIkn_jFZVIQdQb_Rt1h5beBninNqLc",
  authDomain: "shriyashwebreichw1.firebaseapp.com",
  databaseURL: "https://shriyashwebreichw1-default-rtdb.firebaseio.com",
  projectId: "shriyashwebreichw1",
  storageBucket: "shriyashwebreichw1.firebasestorage.app",
  messagingSenderId: "934930360580",
  appId: "1:934930360580:web:507ca57c54547cf6044851",
  measurementId: "G-VXQDNRJLFD",
  databaseURL:"https://shriyashwebreichw1-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
export default app;