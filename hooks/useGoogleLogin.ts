// hooks/useGoogleLogin.ts
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { auth } from "../firebase/config";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = () => {
    // 👇 여기에 너가 설정한 클라이언트 ID들을 넣어줘
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: "179619087490-fd3s366osj6s2qghttrmidjgulvujc8s.apps.googleusercontent.com",
        androidClientId: "179619087490-fd3s366osj6s2qghttrmidjgulvujc8s.apps.googleusercontent.com",
        iosClientId: "179619087490-fd3s366osj6s2qghttrmidjgulvujc8s.apps.googleusercontent.com",
    } as any);

    useEffect(() => {
        if (response?.type === "success" && response.authentication?.idToken) {
            const credential = GoogleAuthProvider.credential(response.authentication.idToken);
            signInWithCredential(auth, credential)
                .then((userCredential) => {
                    console.log("✅ 로그인 성공:", userCredential.user.displayName);
                })
                .catch((err) => {
                    console.error("❌ Firebase 로그인 실패:", err);
                });
        }
    }, [response]);

    const login = () => {
        promptAsync();
    };

    return { login };
};