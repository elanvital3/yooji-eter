// 📁 firebase/config.ts
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// 🔐 Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyAP9e9e6OGgsLb-yxEjuyC8vr98J7dssnY",
    authDomain: "yooji-eter-8780c.firebaseapp.com",
    projectId: "yooji-eter-8780c",
    storageBucket: "yooji-eter-8780c.appspot.com",
    messagingSenderId: "179619087490",
    appId: "1:179619087490:web:59586142b29e82fa1be09b",
    measurementId: "G-E201R8BL8R",
};

// ✅ Firebase 초기화
const app = initializeApp(firebaseConfig);

// ✅ React Native 환경에서 세션 유지 설정
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Firestore
const db = getFirestore(app);

export { auth, db };