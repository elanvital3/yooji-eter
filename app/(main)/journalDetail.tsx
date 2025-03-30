// 📁 app/(main)/journalDetail.tsx
import { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { db } from "../../firebase/config";
import {
    doc,
    getDoc,
    updateDoc,
    collection,
    setDoc,
} from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

type ChecklistItem = {
    title: string;
    checked: boolean;
};

export default function JournalDetailScreen() {
    const { journalId } = useLocalSearchParams();
    const [type, setType] = useState("");
    const [startedAt, setStartedAt] = useState<Date | null>(null);
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const dateKey = selectedDate.toISOString().slice(0, 10); // '2025-04-03'

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

    const toggleItem = async (index: number) => {
        const updated = [...checklist];
        updated[index].checked = !updated[index].checked;
        setChecklist(updated);

        try {
            const ref = doc(db, `journals/${journalId}/dailyLogs/${dateKey}`);
            await setDoc(ref, {
                checklist: updated,
                completedAt: new Date(),
            });

            const allChecked = updated.every((item) => item.checked);
            if (allChecked) {
                Alert.alert("👏 잘했어요!", `${dateKey}의 모든 항목을 완료했어요!`);
            }
        } catch (err) {
            console.error("체크 저장 실패:", err);
            Alert.alert("오류", "저장 중 문제가 발생했습니다.");
        }
    };

    const handleDateChange = (event: any, selected?: Date) => {
        setShowDatePicker(false);
        if (selected) setSelectedDate(selected);
    };

    if (loading || !startedAt) return <ActivityIndicator size="large" />;

    const dayNumber =
        Math.floor(
            (selectedDate.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

    return (
        <View style={styles.container}>
            {/* 📁 app/(main)/journalDetail.tsx 내부 날짜 표시 영역 대체 */}

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <TouchableOpacity onPress={() => setSelectedDate(prev => {
                    const newDate = new Date(prev);
                    newDate.setDate(newDate.getDate() - 1);
                    return newDate;
                })}>
                    <Text style={{ fontSize: 24, paddingHorizontal: 16 }}>⬅️</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <View style={{ alignItems: "center" }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                            📘 {type || "다이어트"} 유지일기 — Day {dayNumber}
                        </Text>
                        <Text style={{ fontSize: 14, color: "#555", textAlign: "center" }}>
                            {selectedDate.toISOString().slice(0, 10)}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setSelectedDate(prev => {
                    const newDate = new Date(prev);
                    newDate.setDate(newDate.getDate() + 1);
                    return newDate;
                })}>
                    <Text style={{ fontSize: 24, paddingHorizontal: 16 }}>➡️</Text>
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDateChange}
                    maximumDate={new Date()} // 미래 선택 방지
                />
            )}

            {/* 체크리스트 */}
            <View style={styles.list}>
                {checklist.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.itemRow}
                        onPress={() => toggleItem(index)}
                    >
                        <Text style={[styles.itemText, item.checked && styles.checked]}>
                            {item.checked ? "☑️" : "⬜"} {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
    subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
    list: { gap: 14 },
    itemRow: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    itemText: { fontSize: 18 },
    checked: { textDecorationLine: "line-through", color: "#999" },
});