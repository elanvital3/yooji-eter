// 📁 app/(auth)/signupNicknameScreen.tsx

import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Colors } from "../../constants/Colors"; // Colors 임포트

export default function SignupNicknameScreen() {
    const { email, password } = useLocalSearchParams();
    const [nickname, setNickname] = useState("");
    const router = useRouter();

    const handleNext = () => {
        if (nickname.length < 2) {
            Alert.alert("닉네임은 2자 이상이어야 해요.");
            return;
        }

        router.push({
            pathname: "/(auth)/signupHeightScreen",
            params: { email, password, nickname },
        } as any);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>닉네임을 입력해주세요</Text>

            <TextInput
                placeholder="예: 유지어터짱"
                value={nickname}
                onChangeText={setNickname}
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
        marginBottom: 20,
        width: "100%",
    },
    buttonText: {
        color: Colors.light.tint, // 버튼 텍스트 색상
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
    },
});