import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getEvn } from "./getEnv";

const firebaseConfig = {
  apiKey: getEvn("VITE_FIREBASE_API"),
  authDomain: "mern-blog-52f27.firebaseapp.com",
  projectId: "mern-blog-52f27",
  storageBucket: "mern-blog-52f27.firebasestorage.app",
  messagingSenderId: "1057591201864",
  appId: "1:1057591201864:web:c2fa06e68e5803dd87087d",
  measurementId: "G-0S8SKGCB04",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
