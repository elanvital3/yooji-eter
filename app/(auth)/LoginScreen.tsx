import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { commonStyles } from "../../constants/styles";  // 공통 스타일 임포트

export default function LoginScreen() {
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        // 로그인 처리
        router.replace("/(main)");
    };

    return (
        <View style={commonStyles.container}>
            <Text style={commonStyles.title}>비밀번호를 입력해주세요</Text>
            <TextInput
                placeholder="비밀번호"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={commonStyles.input}
            />
            <TouchableOpacity onPress={handleLogin}>
                <Text style={commonStyles.loginButton}>로그인</Text>
            </TouchableOpacity>
        </View>
    );
}