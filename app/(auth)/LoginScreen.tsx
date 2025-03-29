import { View, Text, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";

export default function LoginScreen() {
    const { email } = useLocalSearchParams();
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email as string, password);
            router.replace("/main/HomeScreen");
        } catch (error: any) {
            Alert.alert("로그인 실패", error.message);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>비밀번호를 입력해주세요</Text>
            <Text style={{ marginBottom: 20 }}>{email}</Text>

            <TextInput
                placeholder="비밀번호"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 20,
                }}
            />

            <Button title="로그인" onPress={handleLogin} />
        </View>
    );
}