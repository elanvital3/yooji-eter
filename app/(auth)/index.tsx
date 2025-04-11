// 📁 app/(auth)/index.tsx
import { TextInput, TouchableOpacity, Text, View, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { checkUserExists } from "../../utils/checkUserExists";
import { styles } from "../../constants/authStyles";  // 공통 스타일 임포트

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
        <View style={styles.subContainer}>
            <Text style={styles.title}>이메일을 입력해주세요</Text>

            <TextInput
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={styles.input}  // 공통 스타일 적용
            />

            <TouchableOpacity onPress={handleNext}>
                <Text style={styles.buttonText}>다음</Text>
            </TouchableOpacity>
        </View>
    );
}