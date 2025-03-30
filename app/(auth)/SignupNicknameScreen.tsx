// 📁 app/(auth)/signupNicknameScreen.tsx

import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";

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
        <View style={{ width: "100%", paddingHorizontal: 24 }}>
            <Text
                style={{
                    fontSize: 20,
                    marginBottom: 12,
                    fontFamily: "Pretendard-Bold",
                    textAlign: "center",
                }}
            >
                닉네임을 입력해주세요
            </Text>

            <TextInput
                placeholder="예: 유지어터짱"
                value={nickname}
                onChangeText={setNickname}
                style={{
                    fontFamily: "Pretendard-Bold",
                    borderWidth: 1,
                    borderColor: "#6A4FB6",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 20,
                    width: "100%",
                }}
            />

            <TouchableOpacity onPress={handleNext}>
                <Text
                    style={{
                        color: "#6A4FB6",
                        fontSize: 16,
                        fontFamily: "Pretendard-Bold",
                        textAlign: "center",
                    }}
                >
                    다음
                </Text>
            </TouchableOpacity>
        </View>
    );
}