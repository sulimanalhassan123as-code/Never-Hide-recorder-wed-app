// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZrSUYIyneoTdQP4o5by25Dd10BFTd0Ew",
  authDomain: "never-hide-recorder.firebaseapp.com",
  projectId: "never-hide-recorder",
  storageBucket: "never-hide-recorder.appspot.com",
  messagingSenderId: "1013655836375",
  appId: "1:1013655836375:web:f77bed8ca8e8f0e1e58292",
  measurementId: "G-2478D7MRP6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export { ref, uploadBytes, getDownloadURL, listAll };
