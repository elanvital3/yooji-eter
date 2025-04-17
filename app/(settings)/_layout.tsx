// 📁 app/(settings)/_layout.tsx

import { Slot } from "expo-router";
import { Image, View, TouchableOpacity, Text } from "react-native";
import { styles } from "../../constants/journalStyles";  // 공통 스타일 임포트
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config"; // Firestore 임포트
import { format } from 'date-fns'; // 날짜 포맷을 위한 라이브러리
import BottomTabBar from '../../components/BottomTabBar';

export default function SettingLayout() {
    const [nickname, setNickname] = useState<string | null>(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);  // 메뉴 표시 상태
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setNickname(userSnap.data().nickname);
                } else {
                    console.log("사용자 정보가 없습니다.");
                }
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/(auth)"); // 로그아웃 후 auth 화면으로 리디렉션
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    const currentDate = format(new Date(), 'yyyy-MM-dd'); // 현재 날짜 포맷팅

    return (
        <View style={styles.mainContainer}>
            {/* 상단 배치 */}
            {/* <View style={styles.topContainer}> */}
            <TouchableOpacity style={styles.topContainer} onPress={() => setIsMenuVisible(!isMenuVisible)}>
                <Text style={styles.nickName}>{nickname}</Text>
                <Text style={styles.menuText}> ⋮</Text>
            </TouchableOpacity>
            {isMenuVisible && (
                <>
                    {/* ✅ 화면 전체를 덮는 투명 오버레이 (빈 곳 터치 시 메뉴 닫힘) */}
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 10,
                        }}
                        activeOpacity={1}
                        onPress={() => setIsMenuVisible(false)}
                    />

                    {/* ✅ 드롭다운 메뉴 */}
                    <View style={[styles.dropdownMenu, { zIndex: 11 }]}>
                        <TouchableOpacity
                            style={styles.topMenu1}
                            onPress={async () => {
                                setIsMenuVisible(false);
                                await handleLogout();
                            }}
                        >
                            <Text style={styles.menuDetail}>로그아웃</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.topMenu2}
                            onPress={() => {
                                setIsMenuVisible(false);
                                console.log("📌 다른 옵션 선택됨");
                            }}
                        >
                            <Text style={styles.menuDetail}>다른옵션</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {/* </View > */}


            {/* Slot: 남은 공간을 차지하도록 수정 */}
            <View style={styles.subContainer}>
                <Slot />
            </View>

            <BottomTabBar />
        </View>
    );
}