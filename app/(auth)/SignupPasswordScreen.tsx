import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function SignupPasswordScreen() {
    const { email } = useLocalSearchParams();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const router = useRouter();

    const handleNext = () => {
        if (password.length < 6) {
            Alert.alert("비밀번호는 6자리 이상이어야 해요.");
            return;
        }
        if (password !== confirm) {
            Alert.alert("비밀번호가 일치하지 않아요.");
            return;
        }

        router.push({
            pathname: "/(auth)/SignupNicknameScreen",
            params: { email, password },
        } as any);
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>비밀번호를 입력해주세요</Text>

            <TextInput
                placeholder="비밀번호"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={inputStyle}
            />

            <TextInput
                placeholder="비밀번호 확인"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
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