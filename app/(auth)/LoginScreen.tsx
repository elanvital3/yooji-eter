// 📁 app/(auth)/loginScreen.tsx

import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { styles } from "../../constants/authStyles";  // 공통 스타일 임포트

export default function LoginScreen() {
    const { email } = useLocalSearchParams();
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email as string, password);
            router.replace("/(journal)");
        } catch (error: any) {
            Alert.alert("로그인 실패", error.message);
        }
    };

    return (
        <View style={styles.subContainer}>
            <Text style={styles.title}>비밀번호를 입력해주세요</Text>
            <TextInput
                placeholder="비밀번호"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />
            <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
        </View>
    );
}