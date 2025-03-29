import { View, Text, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "expo-router";

export default function HomeScreen() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/(auth)/index" as any); // 로그아웃 후 로그인화면으로 이동
        } catch (err) {
            console.error("❌ 로그아웃 실패:", err);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>🏠 홈 화면입니다!</Text>
            <Button title="로그아웃" onPress={handleLogout} />
        </View>
    );
}