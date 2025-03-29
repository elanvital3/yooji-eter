import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ initializeAuth 안 씀

const firebaseConfig = {
    apiKey: "AIzaSyAP9e9e6OGgsLb-yxEjuyC8vr98J7dssnY",
    authDomain: "yooji-eter-8780c.firebaseapp.com",
    projectId: "yooji-eter-8780c",
    storageBucket: "yooji-eter-8780c.firebasestorage.app",
    messagingSenderId: "179619087490",
    appId: "1:179619087490:web:59586142b29e82fa1be09b",
    measurementId: "G-E201R8BL8R",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ 단순 버전으로 변경

export { auth };