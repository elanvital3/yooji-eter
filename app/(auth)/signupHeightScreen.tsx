// 📁 app/(auth)/signupHeightScreen.tsx

import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const db = getFirestore();

export default function SignupHeightScreen() {
    const { email, password, nickname } = useLocalSearchParams();
    const [height, setHeight] = useState("");
    const router = useRouter();

    const handleSignup = async () => {
        if (!/^\d+$/.test(height)) {
            Alert.alert("숫자만 입력해주세요.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email as string,
                password as string
            );

            await setDoc(doc(db, "users", userCredential.user.uid), {
                nickname,
                height: Number(height),
                email,
                createdAt: new Date(),
            });

            router.replace("/(main)");
        } catch (err: any) {
            console.error("회원가입 에러:", err);
            Alert.alert("회원가입 실패", err.message);
        }
    };

    return (
        <View style={{ width: "100%", paddingHorizontal: 24 }}>
            <Text
                style={{
                    fontSize: 20,
                    marginBottom: 12,
                    fontFamily: "Pretendard-Bold",
                    textAlign: "center",
                }}
            >
                키를 입력해주세요 (cm)
            </Text>

            <TextInput
                placeholder="예: 175"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                style={{
                    fontFamily: "Pretendard-Bold",
                    borderWidth: 1,
                    borderColor: "#6A4FB6",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 20,
                    width: "100%",
                }}
            />

            <TouchableOpacity onPress={handleSignup}>
                <Text
                    style={{
                        color: "#6A4FB6",
                        fontSize: 16,
                        fontFamily: "Pretendard-Bold",
                        textAlign: "center",
                    }}
                >
                    회원가입 완료
                </Text>
            </TouchableOpacity>
        </View>
    );
}