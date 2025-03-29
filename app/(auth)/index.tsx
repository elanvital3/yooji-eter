import { View, Text, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import { fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "expo-router";

export default function EmailScreen() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    const handleNext = async () => {
        if (!email.includes("@")) {
            Alert.alert("이메일 형식을 확인해주세요.");
            return;
        }

        try {
            console.log("🧪 SignIn methods for email:", email);
            const methods = await fetchSignInMethodsForEmail(auth, "test3@gmail.com");
            console.log("🧪 SignIn methods for email:", methods);
            console.log("🔥 현재 auth 객체 상태:", auth);

            if (methods.includes("password")) {
                // 기존 사용자 → 로그인 화면
                router.push(`/(auth)/LoginScreen?email=${encodeURIComponent(email)}`);
            } else {
                // 신규 사용자 → 회원가입 시작
                router.push(`/(auth)/SignupPasswordScreen?email=${encodeURIComponent(email)}`);
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