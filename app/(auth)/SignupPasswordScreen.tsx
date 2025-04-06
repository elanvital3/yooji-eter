// 📁 app/(auth)/signupPasswordScreen.tsx

import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Colors } from "../../constants/Colors"; // Colors 임포트

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
        <View style={styles.container}>
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

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 20,
        marginBottom: 12,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
        color: Colors.light.text, // 기본 텍스트 색상
    },
    input: {
        fontFamily: "Pretendard-Bold",
        borderWidth: 1,
        borderColor: Colors.light.tint, // 테두리 색상
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        width: "100%",
    },
    buttonText: {
        color: Colors.light.tint, // 버튼 텍스트 색상
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
    },
});