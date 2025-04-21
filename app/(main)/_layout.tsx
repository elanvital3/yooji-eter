// 📁 app/(main)/_layout.tsx

import { Slot } from "expo-router";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { styles } from "../../constants/mainStyles";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { onSnapshot, doc, getDoc, collection } from "firebase/firestore";
import { format } from 'date-fns';
import BottomTabBar from '../../components/BottomTabBar';

type ChecklistItem = {
    title: string;
    checked: boolean;
};

export default function MainLayout() {
    const { journalId } = useLocalSearchParams();
    const [nickname, setNickname] = useState<string | null>(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [point, setPoint] = useState<number>(0);
    const router = useRouter();
    const [journalTitle, setTitle] = useState("");
    const [startedAt, setStartedAt] = useState<Date | null>(null);
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [perfectCount, setPerfectCount] = useState<number>(0);

    const dateKey = selectedDate.toISOString().slice(0, 10);

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setNickname(userSnap.data().nickname);
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
                setTitle(journalData.title);
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

                const todayLog = snapshot.docs.find((doc) => doc.id === dateKey);
                if (todayLog && todayLog.exists()) {
                    setChecklist(todayLog.data().checklist);
                }

                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [journalId, dateKey]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/(auth)");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    const dayNumber =
        startedAt
            ? Math.floor((selectedDate.getTime() + 9 * 60 * 60 * 1000 - startedAt.getTime()) / (1000 * 60 * 60 * 24)) + 1
            : 0;

    return (
        <View style={styles.mainContainer}>
            <View style={styles.topContainer}>
                <TouchableOpacity style={styles.nickNameRow} onPress={() => setIsMenuVisible(!isMenuVisible)}>
                    <Text style={styles.nickName}>{nickname}</Text>
                    <Text style={styles.menuText}> ⋮ </Text>
                </TouchableOpacity>
                <Text style={styles.topTitle}>{journalTitle}</Text>
                <View style={styles.topPoint}>
                    <Text style={styles.pointText}>🔥 {point} pt</Text>
                    <Text style={[styles.pointText, { marginLeft: 8 }]}>🌟 {perfectCount}</Text>
                </View>
                {isMenuVisible && (
                    <>
                        <TouchableOpacity
                            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
                            activeOpacity={1}
                            onPress={() => setIsMenuVisible(false)}
                        />
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
            </View>

            <View style={styles.subContainer}>
                <Slot />
            </View>

            <BottomTabBar />
        </View>
    );
}
