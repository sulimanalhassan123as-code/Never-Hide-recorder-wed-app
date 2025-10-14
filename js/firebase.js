// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZrSUYIyneoTdQP4o5by25Dd10BFTd0Ew",
  authDomain: "never-hide-recorder.firebaseapp.com",
  projectId: "never-hide-recorder",
  storageBucket: "never-hide-recorder.appspot.com",
  messagingSenderId: "1013655836375",
  appId: "1:1013655836375:web:f77bed8ca8e8f0e1e58292",
  measurementId: "G-2478D7MRP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
