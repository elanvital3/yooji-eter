// 📁 app/(main)/_layout.tsx
import { Stack } from "expo-router";
import { Image, View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebase/config"; // db를 import
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore에서 데이터 가져오기
import { useState, useEffect } from "react";

export default function MainLayout() {
    const [nickname, setNickname] = useState<string | null>(null);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/(auth)"); // 로그아웃 후 auth 화면으로 리디렉션
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid); // 현재 로그인된 사용자의 UID로 문서 참조
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setNickname(userSnap.data().nickname); // Firestore에서 닉네임 가져오기
                } else {
                    console.log("사용자 정보가 없습니다.");
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#F7F3FF", paddingTop: 70 }}>
            {/* 캐릭터를 화면 좌측에 작게 배치 */}
            <View style={{ position: "absolute", top: 45, left: 16, zIndex: 10 }}>
                <Image
                    source={require("../../assets/images/mainCharacter.png")}
                    style={{ width: 30, height: 30, resizeMode: "contain" }}
                />
            </View>

            {/* 로그아웃 버튼 */}
            <TouchableOpacity
                onPress={handleLogout}
                style={{
                    position: "absolute",
                    top: 30,
                    right: 10,
                    padding: 10,
                    zIndex: 11,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {nickname && (
                    <Text style={{ color: "#6A4FB6", top: 10, fontSize: 16, marginRight: 10, fontFamily: "Pretendard-Bold", }}>
                        ({nickname})
                    </Text>
                )}
                <Text style={{ color: "#6A4FB6", top: 10, fontSize: 16, fontFamily: "Pretendard-Bold", }}>logout</Text>
            </TouchableOpacity>

            <Stack
                screenOptions={{
                    headerShown: false, // 헤더 제거
                }}
            />
        </View>
    );
}