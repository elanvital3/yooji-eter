// 📁 app/(auth)/signupHeightScreen.tsx

import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { Colors } from "../../constants/Colors"; // Colors 임포트

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
        <View style={styles.container}>
            <Text style={styles.title}>키를 입력해주세요 (cm)</Text>

            <TextInput
                placeholder="예: 175"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                style={styles.input}
            />

            <TouchableOpacity onPress={handleSignup}>
                <Text style={styles.buttonText}>회원가입 완료</Text>
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