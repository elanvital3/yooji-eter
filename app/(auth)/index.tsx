// 📁 app/(auth)/index.tsx

import { TextInput, TouchableOpacity, Text, View, Alert, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { checkUserExists } from "../../utils/checkUserExists";
import { Colors } from "../../constants/Colors"; // 색상 임포트

export default function EmailScreen() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleNext = async () => {
        if (!email.includes("@")) {
            Alert.alert("이메일 형식을 확인해주세요.");
            return;
        }

        const exists = await checkUserExists(email);
        if (exists) {
            router.push(`/(auth)/loginScreen?email=${encodeURIComponent(email)}`);
        } else {
            router.push(`/(auth)/signupPasswordScreen?email=${encodeURIComponent(email)}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>이메일을 입력해주세요</Text>

            <TextInput
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
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
        width: "100%",
        borderWidth: 1,
        borderColor: Colors.light.tint, // 테두리 색상
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    buttonText: {
        color: Colors.light.tint, // 버튼 텍스트 색상
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
    },
});