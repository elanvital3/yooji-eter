// 📁 파일 경로: app/(main)/index.tsx
import { View, Text, Button, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";

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

    return (
        <View style={{ padding: 20 }}>
            {journal ? (
                <TouchableOpacity
                    onPress={() =>
                        router.push({
                            pathname: "/(main)/journalDetail",
                            params: { journalId: journal.id },
                        })
                    }
                    style={{
                        backgroundColor: "#e0f7fa",
                        padding: 16,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                        📘 {journal.type} 유지일기 진행 중
                    </Text>
                    <Text>시작 몸무게: {journal.startWeight}kg</Text>
                    <Text>시작 날짜: {journal.startedAt.slice(0, 10)}</Text>
                    <Text style={{ marginTop: 6, color: "#007aff" }}>→ 자세히 보기</Text>
                </TouchableOpacity>
            ) : (
                <View>
                    <Text style={{ fontSize: 16, marginBottom: 12 }}>
                        진행 중인 유지일기가 없습니다.
                    </Text>
                    <Button
                        title="유지일기 시작하기"
                        onPress={() => router.push("/(main)/selectDietType")}
                    />
                </View>
            )}
        </View>
    );
}