// 파일: 프로젝트 경로: app/(settings)/index.tsx

import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { styles } from '../../constants/settingsStyles';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function SettingsScreen() {
    const [alarmHours, setAlarmHours] = useState<number[]>([]);

    useEffect(() => {
        const fetchTimes = async () => {
            if (!auth.currentUser) return;
            const ref = doc(db, "users", auth.currentUser.uid, "settings", "notification");
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setAlarmHours(snap.data().hours || []);
            }
        };
        fetchTimes();
    }, []);

    const toggleHour = async (hour: number) => {
        let updated: number[];
        if (alarmHours.includes(hour)) {
            updated = alarmHours.filter((h) => h !== hour);
        } else {
            updated = [...alarmHours, hour];
        }
        setAlarmHours(updated);

        if (auth.currentUser) {
            const ref = doc(db, "users", auth.currentUser.uid, "settings", "notification");
            await setDoc(ref, { hours: updated }, { merge: true });
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
                            alarmHours.includes(i) && styles.hourBoxSelected
                        ]}
                        onPress={() => toggleHour(i)}
                    >
                        <Text
                            style={[
                                styles.hourText,
                                alarmHours.includes(i) && styles.hourTextSelected
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
