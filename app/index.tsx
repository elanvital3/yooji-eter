// app/index.tsx
import { useEffect } from "react";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Index() {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace("/(main)");
            } else {
                router.replace("/(auth)");
            }
        });

        return () => unsubscribe();
    }, []);

    return null;
}