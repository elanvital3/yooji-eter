// 📁 app/(settings)/index.tsx
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { styles } from '../../constants/settingsStyles';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { saveAndScheduleNotifications } from '../../utils/notificationUtils'; // ✅ 유틸 임포트

export default function SettingsScreen() {
    const [alarmHours, setAlarmHours] = useState<number[]>([]);

    useEffect(() => {
        const fetchTimes = async () => {
            if (!auth.currentUser) return;
            const ref = doc(db, "users", auth.currentUser.uid, "settings", "notification");
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data();
                setAlarmHours(data.hours || []);
            }
        };
        fetchTimes();
    }, []);

    const toggleHour = async (hour: number) => {
        try {
            const updated = alarmHours.includes(hour)
                ? alarmHours.filter((h) => h !== hour)
                : [...alarmHours, hour];

            setAlarmHours(updated);

            await saveAndScheduleNotifications(updated); // ✅ 저장 + 예약 한방 처리

            console.log("✅ 알림 설정 완료:", updated);
        } catch (err) {
            console.error("❌ 알림 설정 중 오류:", err);
            Alert.alert("오류", "알림 설정 중 문제가 발생했습니다.");
        }
    };

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.label}>알림 시간 선택 (중복 선택 가능)</Text>
            <View style={styles.hourGrid}>
                {Array.from({ length: 24 }, (_, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[
                            styles.hourBox,
                            alarmHours.includes(i) && styles.hourBoxSelected,
                        ]}
                        onPress={() => toggleHour(i)}
                    >
                        <Text
                            style={[
                                styles.hourText,
                                alarmHours.includes(i) && styles.hourTextSelected,
                            ]}
                        >
                            {i}시
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}