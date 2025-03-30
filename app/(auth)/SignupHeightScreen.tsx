import { View, Text, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getFirestore, setDoc, doc } from "firebase/firestore";

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

            // Firestore에 추가 정보 저장
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
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>키를 입력해주세요 (cm)</Text>

            <TextInput
                placeholder="예: 175"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                style={inputStyle}
            />

            <Button title="회원가입 완료" onPress={handleSignup} />
        </View>
    );
}

const inputStyle = {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
};