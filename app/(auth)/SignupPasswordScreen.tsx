// 📁 app/(auth)/signupPasswordScreen.tsx

import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function SignupPasswordScreen() {
    const { email } = useLocalSearchParams();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const router = useRouter();

    const handleNext = () => {
        if (password.length < 6) {
            Alert.alert("비밀번호는 6자리 이상이어야 해요.");
            return;
        }
        if (password !== confirm) {
            Alert.alert("비밀번호가 일치하지 않아요.");
            return;
        }

        router.push({
            pathname: "/(auth)/signupNicknameScreen",
            params: { email, password },
        } as any);
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
                회원가입: 비밀번호를 입력해주세요
            </Text>

            <TextInput
                placeholder="비밀번호"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                    fontFamily: "Pretendard-Bold",
                    borderWidth: 1,
                    borderColor: "#6A4FB6",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 10,
                    width: "100%",
                }}
            />

            <TextInput
                placeholder="비밀번호 확인"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
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

            <TouchableOpacity onPress={handleNext}>
                <Text
                    style={{
                        color: "#6A4FB6",
                        fontSize: 16,
                        fontFamily: "Pretendard-Bold",
                        textAlign: "center",
                    }}
                >
                    다음
                </Text>
            </TouchableOpacity>
        </View>
    );
}