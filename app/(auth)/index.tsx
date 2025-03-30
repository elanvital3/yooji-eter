// app/(auth)/EmailScreen.tsx
console.log("🔥auth 진입 !!")
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { checkUserExists } from "../../utils/checkUserExists";

export default function EmailScreen() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleNext = async () => {
        if (!email.includes("@")) {
            Alert.alert("이메일 형식을 확인해주세요.");
            return;
        }

        try {
            const exists = await checkUserExists(email);
            console.log("✅ 이메일 존재 여부:", exists);

            if (exists) {
                // 기존 사용자 → 로그인 화면
                router.push(`/(auth)/loginScreen?email=${encodeURIComponent(email)}`);
            } else {
                // 신규 사용자 → 회원가입 시작
                router.push(`/(auth)/signupPasswordScreen?email=${encodeURIComponent(email)}`);
            }
        } catch (error) {
            console.error("이메일 확인 중 에러:", error);
            Alert.alert("에러", "이메일 확인 중 문제가 발생했습니다.");
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 12 }}>이메일을 입력해주세요</Text>

            <TextInput
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 20,
                }}
            />

            <Button title="다음" onPress={handleNext} />
        </View>
    );
}