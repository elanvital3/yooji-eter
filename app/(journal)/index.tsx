// 📁 app/(journal)/index.tsx
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { styles } from "../../constants/journalStyles";  // 공통 스타일 임포트
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { AntDesign } from '@expo/vector-icons';
import { Colors } from "../../constants/Colors"; // Colors 임포트
type Journal = {
    id: string;
    type: string;
    startWeight: number;
    startedAt: string;
    status: string;
};

export default function HomeScreen() {
    const [journals, setJournals] = useState<Journal[]>([]);  // 여러 일기를 저장하기 위해 배열 사용
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(
                    collection(db, "journals"),
                    where("userId", "==", user.uid),
                    // where("status", "==", "in_progress")
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const journalsData: Journal[] = [];
                    querySnapshot.forEach((doc) => {
                        journalsData.push({
                            id: doc.id,
                            type: doc.data().type,
                            startWeight: doc.data().startWeight,
                            startedAt: doc.data().startedAt.toDate().toISOString(),
                            status: doc.data().status || "in_progress", // ✅ 기본값 처리
                        });
                    });
                    setJournals(journalsData);  // 여러 일기 저장
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <ActivityIndicator size="large" />;
    // ✅ 버튼 기능 함수들
    const handleActivate = async (targetId: string) => {
        if (!auth.currentUser) return;

        const q = query(
            collection(db, "journals"),
            where("userId", "==", auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);

        for (const d of snapshot.docs) {
            await updateDoc(doc(db, "journals", d.id), {
                status: d.id === targetId ? "in_progress" : "inactive"
            });
        }

        // ✅ 상태 새로고침
        reloadJournals();
    };

    const handleDeactivate = async (targetId: string) => {
        await updateDoc(doc(db, "journals", targetId), {
            status: "inactive"
        });

        reloadJournals();
    };

    const handleDelete = async (targetId: string) => {
        await deleteDoc(doc(db, "journals", targetId));
        reloadJournals();
    };

    // ✅ 저널 다시 불러오는 함수
    const reloadJournals = async () => {
        if (!auth.currentUser) return;

        const q = query(
            collection(db, "journals"),
            where("userId", "==", auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const data: Journal[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            type: doc.data().type,
            startWeight: doc.data().startWeight,
            startedAt: doc.data().startedAt.toDate().toISOString(),
            status: doc.data().status, // ✅ status 포함
        }));
        setJournals(data);
    };

    const calculateDays = (startDate: string) => {
        const start = new Date(startDate);
        const today = new Date();
        const diffTime = today.getTime() - start.getTime();
        return Math.floor(diffTime / (1000 * 3600 * 24));
    };

    return (
        <>
            {/* 여러 일기 표시 */}
            {journals.length > 0 ? (

                <FlatList
                    style={styles.journalContainer}
                    data={journals}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.journalCard,
                                item.status === "in_progress" && { backgroundColor: "#E0F7FA" } // ✅ 강조 배경
                            ]}
                        >
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={() => {
                                    router.push({
                                        pathname: "/(main)",
                                        params: { journalId: item.id },
                                    });
                                }}
                            >
                                <AntDesign name="book" size={30} style={styles.icon} />
                                <View >
                                    <Text style={styles.journalType}>{item.type}</Text>
                                    <Text style={styles.dDay}>+ {calculateDays(item.startedAt)} Day</Text>
                                </View>
                            </TouchableOpacity>
                            {/* ✅ 버튼 3개 우측 정렬 */}
                            <View style={{ gap: 4, justifyContent: 'center', marginLeft: 10 }}>
                                <TouchableOpacity onPress={() => handleActivate(item.id)}>
                                    <Text>활성화</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeactivate(item.id)}>
                                    <Text>비활성화</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                    <Text>삭제</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    )}
                />
            ) : (
                <Text style={styles.title}>진행 중인 유지일기가 없습니다.</Text>
            )}

            {/* 유지일기 시작하기 버튼 */}
            <TouchableOpacity style={styles.startButton} onPress={() => router.push("/(journal)/selectDietType")}>
                <Text style={styles.startButtonText}>유지일기 생성하기</Text>
            </TouchableOpacity>
        </>
    );
}