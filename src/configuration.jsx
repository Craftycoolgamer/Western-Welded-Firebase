// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; //Do not have storage tier 
import { getDatabase } from "firebase/database";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7TsecXi2gMrYLG6_OEVa6dqq5EKIox6k",
  authDomain: "western-welded-7df50.firebaseapp.com",
  databaseURL: "https://western-welded-7df50-default-rtdb.firebaseio.com",
  projectId: "western-welded-7df50",
  storageBucket: "western-welded-7df50.firebasestorage.app",
  messagingSenderId: "895109999072",
  appId: "1:895109999072:web:c1f2ebea876fb4d3b86385"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getDatabase(app);

// Export all Firebase services
export { 
  app,
  auth,
  db,
  storage,
};

// Alternatively, you could export as default:
// export default { app, auth, db, storage };