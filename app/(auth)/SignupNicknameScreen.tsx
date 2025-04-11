// 📁 app/(auth)/signupNicknameScreen.tsx

import React, { useState } from "react";
import { TextInput, TouchableOpacity, Text, View, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { styles } from "../../constants/authStyles";  // 공통 스타일 임포트

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
        <View style={styles.subContainer}>
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