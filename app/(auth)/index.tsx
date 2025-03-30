// 📁 app/(auth)/index.tsx

import { TextInput, TouchableOpacity, Text, View, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { checkUserExists } from "../../utils/checkUserExists";
import CustomText from "../../components/CustomText";

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
        <View style={{ width: "100%" }}>
            <Text style={{ fontSize: 20, marginBottom: 12, fontFamily: "Pretendard-Bold", textAlign: "center", }}>이메일을 입력해주세요</Text>

            <TextInput
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={{
                    fontFamily: "Pretendard-Bold",
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#6A4FB6",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 20,

                }}
            />

            <TouchableOpacity onPress={handleNext}>
                <Text style={{ color: "#6A4FB6", fontSize: 16, fontFamily: "Pretendard-Bold", textAlign: "center", }}>
                    다음
                </Text>
            </TouchableOpacity>
        </View>
    );
}