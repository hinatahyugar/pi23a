// lib/firebaseConfig.ts
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCiWbuic76igzBpwZbr4yxrmvHGYaTLACA",
  authDomain: "forum-pi23.firebaseapp.com",
  projectId: "forum-pi23",
  storageBucket: "forum-pi23.firebasestorage.app",
  messagingSenderId: "785604867613",
  appId: "1:785604867613:web:ae2f1cbe420d6ccffc38f4"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
