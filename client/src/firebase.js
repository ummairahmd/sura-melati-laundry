import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    OAuthProvider
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "API_KEY_AWAK",
    authDomain: "suramelatilaundry.firebaseapp.com",
    projectId: "suramelatilaundry",
    storageBucket: "suramelatilaundry.firebasestorage.app",
    messagingSenderId: "99055038240",
    appId: "1:99055038240:web:d33f3fc995ed55ebeb7145",
    measurementId: "G-VVXD347BLK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");