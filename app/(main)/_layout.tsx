// 📁 app/(main)/_layout.tsx
import { Stack } from "expo-router";
import { Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { router } from "expo-router";

export default function MainLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                contentStyle: { backgroundColor: "#fff" },
                headerRight: () => (
                    <Button
                        title="로그아웃"
                        onPress={async () => {
                            await signOut(auth);
                            router.replace("/(auth)");
                        }}
                    />
                ),
            }}
        />
    );
}