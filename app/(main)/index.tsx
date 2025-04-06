// 📁 app/(main)/index.tsx

import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
import CustomText from "../../components/CustomText";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // react-native-vector-icons 설치 필요
import { AntDesign } from '@expo/vector-icons';
// import { FaBook } from 'react-icons/fa';


type Journal = {
    id: string;
    type: string;
    startWeight: number;
    startedAt: string;
};

export default function HomeScreen() {
    const [journal, setJournal] = useState<Journal | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(
                    collection(db, "journals"),
                    where("userId", "==", user.uid),
                    where("status", "==", "in_progress")
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const doc = querySnapshot.docs[0];
                    setJournal({
                        id: doc.id,
                        type: doc.data().type,
                        startWeight: doc.data().startWeight,
                        startedAt: doc.data().startedAt.toDate().toISOString(),
                    });
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <ActivityIndicator size="large" />;

    const calculateDays = (startDate: string) => {
        const start = new Date(startDate);
        const today = new Date();
        const diffTime = today.getTime() - start.getTime();
        return Math.floor(diffTime / (1000 * 3600 * 24));
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 24,
                backgroundColor: "#F7F3FF", // auth 배경색과 동일
            }}
        >
            {/* 진행 중인 유지일기 정보 */}
            {journal ? (
                <TouchableOpacity
                    style={styles.journalCard}
                    onPress={() => {
                        // 로그로 journalId 확인하기
                        console.log("Navigating to journalDetail with ID:", journal.id);
                        router.push({
                            pathname: "/(main)/journalDetail",
                            params: { journalId: journal.id },
                        } as any);
                    }}
                >
                    {/* <Icon name="book-open" size={30} color="#6A4FB6" style={styles.icon} /> */}

                    <AntDesign name="book" size={30} color="#6A4FB6" style={styles.icon} />

                    <View style={styles.journalInfo}>
                        <Text style={styles.journalType}>{journal.type}</Text>
                        <Text style={styles.dDay}>D-Day {calculateDays(journal.startedAt)}</Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <View>
                    <Text
                        style={{
                            fontSize: 18,
                            marginBottom: 12,
                            color: "#555",
                            textAlign: "center",
                            fontFamily: "Pretendard-Bold",
                        }}
                    >
                        진행 중인 유지일기가 없습니다.
                    </Text>
                </View>
            )}

            <View>
                <TouchableOpacity
                    onPress={() => router.push("/(main)/selectDietType")}
                    style={{
                        backgroundColor: "#6A4FB6", // 버튼 배경색
                        paddingVertical: 12,
                        paddingHorizontal: 24,
                        borderRadius: 8,
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 16,
                            fontFamily: "Pretendard-Bold",
                            textAlign: "center",
                        }}
                    >
                        유지일기 시작하기
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    journalCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
        marginTop: 5,
    },
    journalInfo: {
        justifyContent: "center",
    },
    journalType: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#6A4FB6",
    },
    dDay: {
        fontSize: 16,
        color: "#777",
    },
});