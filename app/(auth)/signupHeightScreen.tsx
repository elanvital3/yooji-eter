// 📁 app/(auth)/signupHeightScreen.tsx

import React, { useState } from "react";
import { TextInput, TouchableOpacity, Text, View, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { styles } from "../../constants/authStyles";  // 공통 스타일 임포트

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

            router.replace("/(journal)");
        } catch (err: any) {
            console.error("회원가입 에러:", err);
            Alert.alert("회원가입 실패", err.message);
        }
    };

    return (
        <View style={styles.subContainer}>
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