import { useEffect, useState } from "react";
import {
    View,
    Switch,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { styles } from "../../constants/journalStyles";
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Colors } from "../../constants/Colors";

type Journal = {
    id: string;
    title: string;
    type: string;
    startWeight: number;
    startedAt: string;
    status: string;
    point: number;
    perfectCount: number;
    period: number;
    goalType: "weight" | "bodyFat" | "muscle";
    currentValue: number;
    targetValue: number;
};

export default function JournalScreen() {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [loading, setLoading] = useState(true);
    // ✅ 상태 추가
    const [showCompleted, setShowCompleted] = useState(false);

    // ✅ FlatList 필터링
    const filteredJournals = journals.filter((j) =>
        showCompleted ? true : j.status !== "completed"
    );
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await loadJournals(user.uid);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loadJournals = async (uid: string) => {
        const q = query(collection(db, "journals"), where("userId", "==", uid));
        const snapshot = await getDocs(q);

        const data: Journal[] = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();
                const { point, perfectCount } = await getPointAndStars(docSnap.id);

                // 자동 완료 처리
                const startedAtDate = data.startedAt.toDate();
                const now = new Date();
                const endDate = new Date(startedAtDate.getTime());
                endDate.setDate(endDate.getDate() + data.period);

                if (now > endDate && data.status !== "completed") {
                    await updateDoc(doc(db, "journals", docSnap.id), {
                        status: "completed",
                    });
                    data.status = "completed";
                }

                return {
                    id: docSnap.id,
                    title: data.title || "",
                    type: data.type,
                    startWeight: data.startWeight,
                    startedAt: data.startedAt.toDate().toISOString(),
                    status: data.status || "in_progress",
                    point,
                    perfectCount,
                    period: data.period,
                    goalType: data.goalType,
                    currentValue: data.currentValue,
                    targetValue: data.targetValue,
                };
            })
        );

        setJournals(data);
    };

    const getPointAndStars = async (journalId: string) => {
        const logsSnapshot = await getDocs(
            collection(db, `journals/${journalId}/dailyLogs`)
        );
        let point = 0;
        let perfectCount = 0;

        logsSnapshot.forEach((doc) => {
            const checklist = doc.data().checklist || [];
            const checkedCount = checklist.filter((item: any) => item.checked).length;
            point += checkedCount;
            if (checklist.length > 0 && checkedCount === checklist.length) {
                perfectCount += 1;
            }
        });

        return { point, perfectCount };
    };

    const handleActivate = async (targetId: string) => {
        if (!auth.currentUser) return;

        const q = query(
            collection(db, "journals"),
            where("userId", "==", auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);

        for (const d of snapshot.docs) {
            await updateDoc(doc(db, "journals", d.id), {
                status: d.id === targetId ? "in_progress" : "inactive",
            });
        }

        await loadJournals(auth.currentUser.uid);
    };

    const handleDeactivate = async (targetId: string) => {
        await updateDoc(doc(db, "journals", targetId), {
            status: "inactive",
        });
        if (auth.currentUser) {
            await loadJournals(auth.currentUser.uid);
        }
    };

    const handleDelete = async (targetId: string) => {
        await deleteDoc(doc(db, "journals", targetId));
        if (auth.currentUser) {
            await loadJournals(auth.currentUser.uid);
        }
    };

    const calculateDays = (startDate: string) => {
        const kstOffset = 9 * 60 * 60 * 1000;
        const getKSTDateStr = (date: Date) =>
            new Date(date.getTime() + kstOffset).toISOString().split("T")[0];
        const start = getKSTDateStr(new Date(startDate));
        const today = getKSTDateStr(new Date());
        return (
            Math.floor(
                (new Date(today).getTime() - new Date(start).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1
        );
    };

    const confirmDelete = (targetId: string) => {
        Alert.alert(
            "정말 삭제하시겠어요?",
            "삭제된 일기는 복구할 수 없습니다.",
            [
                {
                    text: "취소",
                    style: "cancel",
                },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: () => handleDelete(targetId),
                },
            ]
        );
    };

    if (loading) return <ActivityIndicator size="large" />;

    return (
        <>
            {/* ✅ Switch UI 추가 (FlatList 위에) */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontFamily: "Pretendard-Bold", color: Colors.light.text, flex: 1, textAlign: "right" }}>
                    완료된 챌린지 보기
                </Text>
                <Switch
                    value={showCompleted}
                    onValueChange={setShowCompleted}
                    trackColor={{ false: "#ccc", true: Colors.light.primary }}
                    thumbColor="#fff"
                // style={{ flex: 1 }}
                />
            </View>
            {journals.length > 0 ? (

                <FlatList
                    style={styles.journalContainer}
                    data={filteredJournals}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <>
                            <View style={[styles.journalHead,
                            item.status === "in_progress"
                                ? { backgroundColor: Colors.light.primary }
                                : item.status === "completed"
                                    ? { backgroundColor: "#eee", opacity: 0.7 }
                                    : {},
                            ]}>
                                <View style={styles.journalTitleRow}>
                                    <AntDesign name="book" size={24} style={[styles.journalHeadBookIcon, item.status === "in_progress" && { color: "#fff" }]} />
                                    <Text style={[styles.journalHeadTitle, item.status === "in_progress" && { color: "#fff" }]}>
                                        {item.title || "(제목 없음)"}
                                    </Text>
                                </View>


                                <View style={styles.controlRow}>
                                    <Switch
                                        value={item.status === "in_progress"}
                                        onValueChange={(val) => {
                                            if (val) {
                                                handleActivate(item.id);
                                            } else {
                                                handleDeactivate(item.id);
                                            }
                                        }}
                                        trackColor={{
                                            false: "#d3d3d3",
                                            true: "#fff",
                                        }}
                                        thumbColor="#ffffff"
                                    />

                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push({
                                                pathname: "/(journal)/editGoal",
                                                params: { journalId: item.id },
                                            })
                                        }
                                    >
                                        <Ionicons
                                            name="create-outline"
                                            size={20}
                                            style={[styles.editIcon, item.status === "in_progress" && { color: "#fff" }]}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => confirmDelete(item.id)}
                                    >
                                        <Ionicons
                                            name="trash-outline"
                                            size={20}
                                            style={[styles.deleteIcon, item.status === "in_progress" && { color: "#fff" }]}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>


                            <View
                                style={[styles.journalCard]}
                            >
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/(main)",
                                            params: { journalId: item.id },
                                        })
                                    }
                                >
                                    <View style={styles.journalRow}>
                                        <Text style={styles.journalType}>
                                            {item.type}
                                        </Text>
                                        <Text style={styles.startDate}>
                                            시작일 : {format(new Date(item.startedAt), "yy-MM-dd")}
                                        </Text>
                                    </View>



                                    <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 20 }}>
                                        <View style={styles.metricCard}>
                                            <Text style={styles.metricTitle}>
                                                🔥 / 🌟
                                            </Text>
                                            <Text style={styles.metricNumber}>
                                                {item.point} / {item.perfectCount}
                                            </Text>
                                        </View>
                                        <View style={styles.metricCard}>
                                            <Text style={styles.metricTitle}>
                                                ⏳
                                            </Text>
                                            <Text style={styles.metricNumber}>
                                                {calculateDays(item.startedAt)} / {item.period}일
                                            </Text>
                                        </View>
                                        <View style={styles.metricCard}>
                                            <Text style={styles.metricTitle}>
                                                🎯 {item.goalType === "bodyFat"
                                                    ? "지방률"
                                                    : item.goalType === "muscle"
                                                        ? "근육량"
                                                        : "체중"}
                                                {/* {item.goalType === "bodyFat" ? "%" : "kg"} */}

                                            </Text>
                                            <Text style={styles.metricNumber}>
                                                {item.currentValue} / {item.targetValue}

                                            </Text>
                                        </View>


                                    </View>
                                </TouchableOpacity>




                            </View>
                        </>
                    )}
                />
            ) : (
                <Text style={styles.title}>진행 중인 챌린지가 없습니다.</Text>
            )}

            <TouchableOpacity
                style={styles.startButton}
                onPress={() => router.push("/(journal)/setGoal")}
            >
                <Text style={styles.startButtonText}>챌린지 생성하기</Text>
            </TouchableOpacity>
        </>
    );
}
