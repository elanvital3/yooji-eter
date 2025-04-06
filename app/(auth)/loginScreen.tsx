// 📁 app/(auth)/loginScreen.tsx

import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";

export default function LoginScreen() {
    const { email } = useLocalSearchParams();
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email as string, password);
            router.replace("/(main)");
        } catch (error: any) {
            Alert.alert("로그인 실패", error.message);
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
                비밀번호를 입력해주세요
            </Text>

            <TextInput
                placeholder="비밀번호"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                    fontFamily: "Pretendard-Bold",
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#6A4FB6",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 20,
                }}
            />

            <TouchableOpacity onPress={handleLogin}>
                <Text
                    style={{
                        color: "#6A4FB6",
                        fontSize: 16,
                        fontFamily: "Pretendard-Bold",
                        textAlign: "center",
                    }}
                >
                    로그인
                </Text>
            </TouchableOpacity>
        </View>
    );
}