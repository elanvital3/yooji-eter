// 📁 app/(main)/index.tsx
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
import { styles } from "../../constants/mainStyles"
import { format, startOfWeek, addDays } from 'date-fns';

type ChecklistItem = {
    title: string;
    checked: boolean;
};

type WeekDay = {
    date: string; // 'MM-dd'
    day: string;  // 'Mon', 'Tue', ...
};

export default function JournalDetailScreen() {
    const { journalId } = useLocalSearchParams();
    const [type, setType] = useState("");
    const [startedAt, setStartedAt] = useState<Date | null>(null);
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [point, setPoint] = useState(0);
    // const [weekDates, setWeekDates] = useState<string[]>([]);
    const [weekDates, setWeekDates] = useState<WeekDay[]>([]);
    const [baseDate, setBaseDate] = useState(new Date());

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

    // useEffect(() => {
    //     const today = new Date(); // 오늘 날짜
    //     const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 }); // 이번 주의 월요일 계산

    //     // 이번 주의 월요일부터 일요일까지의 날짜를 계산
    //     const dates = Array.from({ length: 7 }).map((_, index) => {
    //         return format(addDays(startOfWeekDate, index), 'MM-dd'); // 각 날짜를 'yyyy-MM-dd' 형식으로
    //     });

    //     setWeekDates(dates); // 주간 날짜 설정
    // }, []);

    useEffect(() => {
        const startOfWeekDate = startOfWeek(baseDate, { weekStartsOn: 1 });

        const weekData: WeekDay[] = Array.from({ length: 7 }).map((_, index) => {
            const dateObj = addDays(startOfWeekDate, index);
            return {
                date: format(dateObj, 'MM-dd'),
                day: format(dateObj, 'EEE'), // Mon, Tue, ...
            };
        });

        setWeekDates(weekData);
    }, [baseDate]);

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
        <>
            {/* ✅ 상단 정보 */}
            {/* <View style={styles.infoRow}>
                <Text style={styles.infoText}>📘 {type}</Text>
                <Text style={styles.infoText}>Day {dayNumber}</Text>
                <Text style={styles.infoText}>🔥 {point}pt</Text>
            </View> */}

            {/* ✅ 달력 */}
            {/* <Calendar
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
            /> */}
            {/* ✅ 달력 */}
            {/* <View style={styles.weekRow}>
                {weekDates.map(({ date, day }, idx) => (
                    <View key={idx} style={styles.dateBox}>
                        <Text style={{ fontSize: 16 }}>{day}</Text>
                        <Text style={{ fontSize: 14, color: 'gray' }}>{date}</Text>
                    </View>

                ))}
            </View> */}
            {/* ✅ 상단 날짜 선택 */}
            <View style={styles.weekRow}>
                {/* ◀ 왼쪽 주 이동 */}
                <TouchableOpacity onPress={() => setBaseDate(prev => addDays(prev, -7))}>
                    <Text style={styles.dateArrow}>◀</Text>
                </TouchableOpacity>

                {/* 날짜 7개 */}
                {weekDates.map(({ date, day }, idx) => (
                    <TouchableOpacity
                        key={idx}
                        style={[
                            styles.dateBox,
                            format(selectedDate, 'MM-dd') === date && styles.selectedDateBox
                        ]}
                        onPress={() => {
                            const fullDate = new Date(`${baseDate.getFullYear()}-${date}`);
                            setSelectedDate(fullDate);
                        }}
                    >
                        <Text
                            style={[
                                styles.dateText,
                                format(selectedDate, 'MM-dd') === date && styles.selectedDateText
                            ]}
                        >
                            {day}
                        </Text>
                        <Text
                            style={[
                                styles.dateSubText,
                                format(selectedDate, 'MM-dd') === date && styles.selectedDateText
                            ]}
                        >
                            {date}
                        </Text>
                    </TouchableOpacity>
                ))}

                {/* ▶ 오른쪽 주 이동 */}
                <TouchableOpacity onPress={() => setBaseDate(prev => addDays(prev, 7))}>
                    <Text style={styles.dateArrow}>▶</Text>
                </TouchableOpacity>
            </View>

            {/* ✅ 체크리스트 */}
            <View style={styles.checkListContainer}>
                {checklist.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.itemRow}
                        onPress={() => toggleItem(index)}
                    >
                        <Text style={[styles.itemText]}>
                            {item.title}
                        </Text>
                        {/* <Text style={[styles.itemText, item.checked && styles.checked]}>
                            {item.checked ? "✅" : "⬜"}
                        </Text> */}
                        <View style={styles.radioOuter}>
                            {item.checked && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );
}