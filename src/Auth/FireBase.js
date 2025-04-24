import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMgLomcLBve7rS0kqZDlx0XVvZ5zdKShk",
  authDomain: "chatbot-gemini-1a7f8.firebaseapp.com",
  projectId: "chatbot-gemini-1a7f8",
  storageBucket: "chatbot-gemini-1a7f8.firebasestorage.app",
  messagingSenderId: "1067986690650",
  appId: "1:1067986690650:web:ce1798a9b28ad561822e63",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
