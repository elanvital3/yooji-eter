// 📁 app/(main)/_layout.tsx

import { Slot } from "expo-router";
import { Image, View, TouchableOpacity, Text, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { styles } from "../../constants/mainStyles";  // 공통 스타일 임포트
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config"; // Firestore 임포트
import { onSnapshot } from "firebase/firestore";
import { format } from 'date-fns'; // 날짜 포맷을 위한 라이브러리
import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
} from "firebase/firestore";
import { MaterialIcons, Ionicons } from '@expo/vector-icons'; // 휴지통 아이콘용
import BottomTabBar from '../../components/BottomTabBar';

type ChecklistItem = {
    title: string;
    checked: boolean;
};

export default function MainLayout() {
    const { journalId } = useLocalSearchParams();
    const [nickname, setNickname] = useState<string | null>(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);  // 메뉴 표시 상태
    const [point, setPoint] = useState<number>(0);  // 포인트 상태
    const router = useRouter();
    const [journalType, setType] = useState("");
    const [startedAt, setStartedAt] = useState<Date | null>(null);
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [perfectCount, setPerfectCount] = useState<number>(0);

    const dateKey = selectedDate.toISOString().slice(0, 10); // e.g. "2025-04-03"

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

    useEffect(() => {
        if (!journalId) return;

        const unsubscribe = onSnapshot(
            collection(db, `journals/${journalId}/dailyLogs`),
            async (snapshot) => {
                const journalRef = doc(db, "journals", journalId as string);
                const journalSnap = await getDoc(journalRef);

                if (!journalSnap.exists()) {
                    Alert.alert("오류", "유지일기 데이터를 찾을 수 없습니다.");
                    return;
                }

                const journalData = journalSnap.data();
                setType(journalData.type);
                setStartedAt(journalData.startedAt.toDate());

                let totalPoints = 0;
                let totalPerfect = 0;

                snapshot.forEach((doc) => {
                    const items: ChecklistItem[] = doc.data().checklist || [];
                    const checkedCount = items.filter((item) => item.checked).length;
                    totalPoints += checkedCount;

                    if (items.length > 0 && checkedCount === items.length) {
                        totalPerfect += 1;
                    }
                });

                setPoint(totalPoints);
                setPerfectCount(totalPerfect);

                // 현재 날짜에 해당하는 checklist만 따로 설정
                const todayLog = snapshot.docs.find(
                    (doc) => doc.id === dateKey
                );
                if (todayLog && todayLog.exists()) {
                    setChecklist(todayLog.data().checklist);
                }

                setLoading(false);
            }
        );

        return () => unsubscribe(); // 🔁 언마운트 시 구독 해제
    }, [journalId, dateKey]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/(auth)"); // 로그아웃 후 auth 화면으로 리디렉션
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    const currentDate = format(new Date(), 'yyyy-MM-dd'); // 현재 날짜 포맷팅
    // console.log(startedAt.getTime())
    const dayNumber =
        startedAt
            ? Math.floor(
                (
                    selectedDate.getTime() + 9 * 60 * 60 * 1000 -
                    startedAt.getTime()
                ) / (1000 * 60 * 60 * 24)
            ) + 1
            : 0;

    return (
        <View style={styles.mainContainer}>
            {/* 상단 배치 */}
            <View style={styles.topContainer}>
                <TouchableOpacity style={styles.nickNameRow} onPress={() => setIsMenuVisible(!isMenuVisible)}>
                    <Text style={styles.nickName}>{nickname}</Text>
                    <Text style={styles.menuText}> ⋮ </Text>
                </TouchableOpacity>
                {/* <Text style={styles.topDate}>{currentDate}</Text> */}
                <Text style={styles.topDday}>{journalType}  ({dayNumber} days) </Text>
                <View style={styles.topPoint}>
                    <Text style={styles.pointText}>🔥 {point} pt</Text>
                    <Text style={[styles.pointText, { marginLeft: 8 }]}>🌟 {perfectCount}</Text>
                </View>
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
            </View >


            {/* Slot: 남은 공간을 차지하도록 수정 */}
            <View style={styles.subContainer}>
                <Slot />
            </View>

            <BottomTabBar />

            {/* <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="home-outline" size={24} color="#555" />
                    <Text style={styles.tabLabel}>홈</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="book-outline" size={24} color="#555" />
                    <Text style={styles.tabLabel}>기록</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Ionicons name="person-outline" size={24} color="#555" />
                    <Text style={styles.tabLabel}>설정</Text>
                </TouchableOpacity>
            </View> */}
        </View>
    );
}