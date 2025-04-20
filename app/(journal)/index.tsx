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

export default function HomeScreen() {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [loading, setLoading] = useState(true);
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

                return {
                    id: docSnap.id,
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
        const start = new Date(new Date(startDate).getTime() + 9 * 60 * 60 * 1000);
        const now = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
        const diffTime = now.getTime() - start.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
            {journals.length > 0 ? (
                <FlatList
                    style={styles.journalContainer}
                    data={journals}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.journalCard,
                                item.status === "in_progress" && {
                                    backgroundColor: Colors.light.lightGray,
                                },
                            ]}
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
                                    <AntDesign name="book" size={30} style={styles.bookIcon} />
                                    <View>
                                        <Text style={styles.journalType}>
                                            {item.type} ({calculateDays(item.startedAt)} Day)
                                        </Text>
                                        <Text style={styles.startDate}>
                                            시작일 : {format(new Date(item.startedAt), "yy-MM-dd")}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{ alignItems: "flex-end" }}>
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
                                            true: Colors.light.primary,
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
                                        <Ionicons name="create-outline" size={20} style={styles.editIcon} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                                        <Ionicons
                                            name="trash-outline"
                                            size={20}
                                            style={styles.deleteIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.startDate}>
                                    🔥 {item.point} pt  |  🌟 {item.perfectCount}
                                </Text>
                                <Text style={styles.startDate}>
                                    ⏳ {calculateDays(item.startedAt)} / {item.period}일 진행 중
                                </Text>
                                <Text style={styles.startDate}>
                                    🎯 목표 {item.goalType === "bodyFat"
                                        ? "체지방률"
                                        : item.goalType === "muscle"
                                            ? "근골격량"
                                            : "체중"}:
                                    {item.currentValue} → {item.targetValue}
                                    {item.goalType === "bodyFat" ? "%" : "kg"}
                                </Text>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.title}>진행 중인 유지일기가 없습니다.</Text>
            )}

            <TouchableOpacity
                style={styles.startButton}
                onPress={() => router.push("/(journal)/setGoal")}
            >
                <Text style={styles.startButtonText}>유지일기 생성하기</Text>
            </TouchableOpacity>
        </>
    );
}
