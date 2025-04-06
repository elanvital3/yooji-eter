import { Stack } from "expo-router";
import { Image, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { auth, db } from "../../firebase/config"; // db를 import
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore에서 데이터 가져오기
import { useState, useEffect } from "react";
import { Colors } from "../../constants/Colors"; // Colors 임포트

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
        <View style={styles.container}>
            {/* 캐릭터를 화면 좌측에 작게 배치 */}
            <View style={styles.characterContainer}>
                <Image
                    source={require("../../assets/images/mainCharacter.png")}
                    style={styles.characterImage}
                />
            </View>

            {/* 로그아웃 버튼 */}
            <TouchableOpacity
                onPress={handleLogout}
                style={styles.logoutButton}
            >
                {nickname && (
                    <Text style={styles.nicknameText}>
                        ({nickname})
                    </Text>
                )}
                <Text style={styles.logoutText}>logout</Text>
            </TouchableOpacity>

            <Stack
                screenOptions={{
                    headerShown: false, // 헤더 제거
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background, // 배경색 흰색
        paddingTop: 70,
    },
    characterContainer: {
        position: "absolute",
        top: 45,
        left: 16,
        zIndex: 10,
    },
    characterImage: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    logoutButton: {
        position: "absolute",
        top: 30,
        right: 10,
        padding: 10,
        zIndex: 11,
        flexDirection: "row",
        alignItems: "center",
    },
    nicknameText: {
        color: Colors.light.tint, // 진한 보라색
        top: 10,
        fontSize: 16,
        marginRight: 10,
        fontFamily: "Pretendard-Bold",
    },
    logoutText: {
        color: Colors.light.tint, // 진한 보라색
        top: 10,
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
    },
});