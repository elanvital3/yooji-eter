// 📁 utils/notificationUtils.ts
import * as Notifications from "expo-notifications";
import { auth, db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";

export const saveAndScheduleNotifications = async (hours: number[]) => {
    if (!auth.currentUser) return;

    const ref = doc(db, "users", auth.currentUser.uid, "settings", "notification");

    // 1. Firestore에 저장
    await setDoc(ref, { hours }, { merge: true });

    // 2. 기존 예약 모두 취소
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 3. 새로운 시간들로 알림 예약
    for (const hour of hours) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🟣 오늘의 체크리스트",
                body: "오늘도 잊지 말고 실천해봐요!",
                sound: "default",
                data: {
                    dateKey: new Date().toISOString().slice(0, 10), // 클릭 시 이동용
                },
            },
            trigger: {
                type: "daily",
                hour,
                minute: 45,
                repeats: true,
            } as Notifications.DailyTriggerInput, // ✅ 핵심 타입 명시
        });
    }

    console.log(`✅ ${hours.length}개의 시간에 알림 저장 + 예약 완료`, hours);
};