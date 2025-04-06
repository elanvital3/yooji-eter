import { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { db } from "../../firebase/config";
import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
} from "firebase/firestore";
import { Calendar, DateData } from "react-native-calendars";
import { Colors } from "../../constants/Colors"; // Colors 임포트

type ChecklistItem = {
    title: string;
    checked: boolean;
};

export default function JournalDetailScreen() {
    const { journalId } = useLocalSearchParams();
    const [type, setType] = useState("");
    const [startedAt, setStartedAt] = useState<Date | null>(null);
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [point, setPoint] = useState(0);

    const dateKey = selectedDate.toISOString().slice(0, 10); // e.g. "2025-04-03"

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
                if (checkedCount === items.length && items.length > 0) {
                    totalPoints += 3; // 보너스
                }
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

    if (loading || !startedAt) return <ActivityIndicator size="large" />;

    const dayNumber =
        Math.floor(
            (selectedDate.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

    return (
        <View style={styles.container}>
            {/* ✅ 상단 정보 */}
            <View style={styles.infoRow}>
                <Text style={styles.infoText}>📘 {type}</Text>
                <Text style={styles.infoText}>Day {dayNumber}</Text>
                <Text style={styles.infoText}>🔥 {point}pt</Text>
            </View>

            {/* ✅ 달력 */}
            <Calendar
                current={selectedDate.toISOString().slice(0, 10)}
                onDayPress={(day: DateData) => {
                    const selected = new Date(day.dateString);
                    setSelectedDate(selected);
                }}
                markedDates={{
                    [selectedDate.toISOString().slice(0, 10)]: {
                        selected: true,
                        selectedColor: Colors.light.tint,
                    },
                }}
                maxDate={new Date().toISOString().slice(0, 10)}
                style={styles.calendar}
                theme={{
                    textDayFontSize: 14,
                    textMonthFontSize: 14,
                    textDayHeaderFontSize: 12,
                    arrowColor: Colors.light.tint,
                }}
            />

            {/* ✅ 체크리스트 */}
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
    container: { flex: 1, padding: 20, backgroundColor: Colors.light.background }, // 배경색 추가
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    infoText: { fontSize: 16, fontWeight: "600", color: Colors.light.tint }, // 보라색 글씨
    calendar: {
        borderRadius: 8,
        elevation: 2,
        marginBottom: 10, // 간격 조정
    },
    list: { gap: 8 }, // 간격 좁힘
    itemRow: {
        paddingVertical: 6, // 간격 좁힘
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    itemText: { fontSize: 18, color: "#555" }, // 기본 텍스트 색상
    checked: { textDecorationLine: "line-through", color: "#999" },
});