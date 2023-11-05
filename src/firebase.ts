// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
type config = {
  apiKey: string,
  authDomain: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string
}

const firebaseConfig: config = {
  apiKey: "AIzaSyAv-YwYsXNv25zTAZpPgZ8n1JcAtQAs3Ys",
  authDomain: "personal-finance-app-6f23f.firebaseapp.com",
  projectId: "personal-finance-app-6f23f",
  storageBucket: "personal-finance-app-6f23f.appspot.com",
  messagingSenderId: "877030721721",
  appId: "1:877030721721:web:a93e1d5538207702e33368"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app);