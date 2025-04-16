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
import { ko } from 'date-fns/locale';

type ChecklistItem = {
    title: string;
    checked: boolean;
};

type WeekDay = {
    date: string;   // 'dd'
    day: string;    // '월', '화', ...
    fullDate: Date; // 날짜 전체
};


export default function JournalDetailScreen() {
    const { journalId, dateKey: paramDateKey } = useLocalSearchParams();

    const initialDate = paramDateKey
        ? new Date(paramDateKey as string)
        : new Date();

    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [baseDate, setBaseDate] = useState(
        startOfWeek(initialDate, { weekStartsOn: 1 })
    );
    const [type, setType] = useState("");
    const [startedAt, setStartedAt] = useState<Date | null>(null);
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [point, setPoint] = useState(0);
    const [weekDates, setWeekDates] = useState<WeekDay[]>([]);
    const [completedDays, setCompletedDays] = useState<Record<string, boolean>>({});

    const getKSTDateKey = (date: Date) => {
        const tzOffset = date.getTime() + 9 * 60 * 60 * 1000; // UTC+9
        return new Date(tzOffset).toISOString().slice(0, 10);
    };

    const dateKey = getKSTDateKey(selectedDate);

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

                const allChecked = dailySnap.data().checklist.every((item: ChecklistItem) => item.checked);
                const key = getKSTDateKey(selectedDate);
                setCompletedDays(prev => ({ ...prev, [key]: allChecked }));
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


    useEffect(() => {
        const startOfWeekDate = startOfWeek(baseDate, { weekStartsOn: 1 });

        const weekData: WeekDay[] = Array.from({ length: 7 }).map((_, index) => {
            const dateObj = addDays(startOfWeekDate, index);
            return {
                date: format(dateObj, 'dd'),
                day: format(dateObj, 'EEE', { locale: ko }),
                fullDate: dateObj, // 🔥 전체 날짜 저장
            };
        });

        setWeekDates(weekData);
    }, [baseDate]);

    useEffect(() => {
        const fetchCompletedDays = async () => {
            if (!journalId) return;

            const startOfWeekDate = startOfWeek(baseDate, { weekStartsOn: 1 });

            const newCompletedDays: Record<string, boolean> = {};

            await Promise.all(
                Array.from({ length: 7 }).map(async (_, index) => {
                    const dateObj = addDays(startOfWeekDate, index);
                    const key = getKSTDateKey(dateObj);
                    const ref = doc(db, `journals/${journalId}/dailyLogs/${key}`);
                    const snap = await getDoc(ref);

                    if (snap.exists()) {
                        const items: ChecklistItem[] = snap.data().checklist || [];
                        newCompletedDays[key] = items.length > 0 && items.every((i) => i.checked);
                    } else {
                        newCompletedDays[key] = false;
                    }
                })
            );

            setCompletedDays(newCompletedDays);
        };

        fetchCompletedDays();
    }, [baseDate, journalId]);

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
            const key = getKSTDateKey(selectedDate);

            setCompletedDays(prev => ({ ...prev, [key]: allChecked }));
            if (allChecked) {
                Alert.alert("👏 잘했어요!", `${dateKey}의 모든 항목을 완료했어요!`);
            }
        } catch (err) {
            console.error("체크 저장 실패:", err);
            Alert.alert("오류", "저장 중 문제가 발생했습니다.");
        }
    };

    const completedCount = checklist.filter(item => item.checked).length;
    const completionRate = checklist.length > 0 ? completedCount / checklist.length : 0;

    if (loading || !startedAt) return <ActivityIndicator size="large" />;

    const dayNumber =
        Math.floor(
            (selectedDate.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

    const getWeekOfMonth = (date: Date): number => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const dayOfWeek = firstDay.getDay();
        const adjustedDate = date.getDate() + dayOfWeek;
        return Math.ceil(adjustedDate / 7);
    };

    const weekLabel = `${baseDate.getFullYear()}-${String(
        baseDate.getMonth() + 1
    ).padStart(2, "0")} (${getWeekOfMonth(baseDate)}W)`;

    const formattedWeekLabel = `${selectedDate.getFullYear()}-${String(
        selectedDate.getMonth() + 1
    ).padStart(2, "0")} (${getWeekOfMonth(selectedDate)}W)`;

    return (
        <>
            {/* ✅ 상단 날짜 선택 */}
            <View style={[styles.weekRow]}>
                <TouchableOpacity onPress={() => setBaseDate(prev => addDays(prev, -7))}>
                    <Text style={styles.dateArrow}>◀</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{weekLabel}</Text>
                <TouchableOpacity onPress={() => setBaseDate(prev => addDays(prev, 7))}>
                    <Text style={styles.dateArrow}>▶</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.dayRow}>

                {/* 날짜 7개 */}
                {weekDates.map(({ date, day, fullDate }, idx) => {
                    const isSelected = selectedDate.toDateString() === fullDate.toDateString();
                    const key = getKSTDateKey(fullDate);
                    const isPerfect = completedDays[key]

                    return (
                        <TouchableOpacity
                            key={idx}
                            style={[styles.dateBox, isSelected && styles.selectedDateBox]}
                            onPress={() => setSelectedDate(fullDate)}
                        >
                            {isPerfect && (
                                <Text style={styles.starBadge}>🌟</Text>
                            )}
                            <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                                {day}
                            </Text>
                            <Text style={[styles.dateSubText, isSelected && styles.selectedDateText]}>
                                {date}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* ✅ 체크리스트 진행 바 */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                    <View
                        style={[
                            styles.progressBarFilled,
                            { width: `${completionRate * 100}%` },
                        ]}
                    />
                    <View style={styles.progressBarTextWrapper}>
                        <Text style={styles.progressBarText}>
                            {completedCount === checklist.length
                                ? "Perfect 🌟"
                                : `${completedCount} / ${checklist.length}`}
                        </Text>
                    </View>
                </View>
            </View>

            {/* ✅ 체크리스트 */}
            <View style={styles.checkListContainer}>
                {checklist.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.itemRow, item.checked && {
                            backgroundColor: "#EEE"
                        }]}
                        onPress={() => toggleItem(index)}
                    >
                        <Text style={[styles.itemText, item.checked && {
                            // textDecorationLine: 'line-through'
                        }]}>
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
            </View >
        </>
    );
}