import { View, Text, TextInput, Button, Alert } from "react-native";
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
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>닉네임을 입력해주세요</Text>

            <TextInput
                placeholder="예: 유지어터짱"
                value={nickname}
                onChangeText={setNickname}
                style={inputStyle}
            />

            <Button title="다음" onPress={handleNext} />
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