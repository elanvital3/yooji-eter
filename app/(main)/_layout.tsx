// app/(main)/_layout.tsx
import { Stack } from "expo-router";

export default function MainLayout() {
    return <Stack
        screenOptions={{
            headerShown: true, // 홈 화면은 헤더 보여주기
            contentStyle: { backgroundColor: "#fff" },
        }}
    />;
}