// 📁 app/(journal)/_layout.tsx

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

export default function JournalLayout() {
    const [nickname, setNickname] = useState<string | null>(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);  // 메뉴 표시 상태
    const [point, setPoint] = useState<number>(0);  // 포인트 상태
    const router = useRouter();
    // console.log(isMenuVisible)

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
            <View style={styles.topContainer}>
                <Text style={styles.topDate}>{currentDate}</Text>
                <View style={styles.topPoint}>
                    <Text style={styles.pointText}>🔥 {point} pt</Text>
                    <TouchableOpacity onPress={() => setIsMenuVisible(!isMenuVisible)}>
                        <Text style={styles.menuText}> ⋮ </Text>
                    </TouchableOpacity>

                    {/* 메뉴 표시 */}
                    {isMenuVisible && (
                        <View style={styles.dropdownMenu}>
                            <TouchableOpacity style={styles.topMenu1} onPress={handleLogout}>
                                <Text style={styles.menuDetail}>로그아웃</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.topMenu2} onPress={handleLogout}>
                                <Text style={styles.menuDetail}>다른옵션</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View >


            {/* Slot: 남은 공간을 차지하도록 수정 */}
            <View style={styles.subContainer}>
                <Slot />
            </View>

            <View style={styles.bottomContainer}>
            </View>
        </View>
    );
}