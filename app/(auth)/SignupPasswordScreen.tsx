// 📁 app/(auth)/signupPasswordScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { styles } from "../../constants/authStyles"; // 공통 스타일 임포트

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
        // 📁 app/(auth)/signupPasswordScreen.tsx
        <View style={styles.subContainer}>
            <Text style={styles.title}>회원가입: 비밀번호를 입력해주세요</Text>

            <TextInput
                placeholder="비밀번호"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <TextInput
                placeholder="비밀번호 확인"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
                style={styles.input}
            />

            <TouchableOpacity onPress={handleNext}>
                <Text style={styles.buttonText}>다음</Text>
            </TouchableOpacity>
        </View>
    );
}