// 📁 app/(main)/_layout.tsx

import { Slot } from "expo-router";
import { Image, View, TouchableOpacity, Text, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { styles } from "../../constants/checkStyles";  // 공통 스타일 임포트
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config"; // Firestore 임포트
import { format } from 'date-fns'; // 날짜 포맷을 위한 라이브러리
import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
} from "firebase/firestore";

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
        const fetchData = async () => {
            if (!journalId) return;

            const journalRef = doc(db, "journals", journalId as string);
            const journalSnap = await getDoc(journalRef);

            if (!journalSnap.exists()) {
                Alert.alert("오류", "유지일기 데이터를 찾을 수 없습니다.");
                return;
            }

            const journalData = journalSnap.data();
            setType(journalData.type);
            setStartedAt(journalData.startedAt.toDate());

            // 총 점수 계산
            const logsSnapshot = await getDocs(collection(db, `journals/${journalId}/dailyLogs`));
            let totalPoints = 0;
            logsSnapshot.forEach((doc) => {
                const items: ChecklistItem[] = doc.data().checklist || [];
                const checkedCount = items.filter((item) => item.checked).length;
                totalPoints += checkedCount;
                // if (checkedCount === items.length && items.length > 0) {
                //     totalPoints += 3; // 보너스
                // }
            });
            setPoint(totalPoints);

            const dailyLogRef = doc(db, `journals/${journalId}/dailyLogs/${dateKey}`);
            const dailySnap = await getDoc(dailyLogRef);

            if (dailySnap.exists()) {
                setChecklist(dailySnap.data().checklist);
            } else {
                const baseChecklist: ChecklistItem[] = journalData.checklist.map(
                    (item: ChecklistItem) => ({
                        ...item,
                        checked: false,
                    })
                );
                setChecklist(baseChecklist);
            }

            setLoading(false);
        };

        fetchData();
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
            ? Math.floor((selectedDate.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24)) + 1
            : 0; // startedAt이 null이면 0으로 처리

    return (
        <View style={styles.mainContainer}>
            {/* 상단 배치 */}
            <View style={styles.topContainer}>
                <Text style={styles.topDate}>{currentDate}</Text>
                <Text style={styles.topDday}>{journalType} ({dayNumber} days) </Text>
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