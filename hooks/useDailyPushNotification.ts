// 📁 hooks/useDailyPushNotification.ts
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

export function useDailyPushNotification(enabled: boolean) {
    useEffect(() => {
        if (!enabled) return;

        const scheduleDailyPush = async () => {
            // 1. 권한 확인
            const permission = await Notifications.getPermissionsAsync();
            if (!permission.granted) {
                const request = await Notifications.requestPermissionsAsync();
                if (!request.granted) {
                    console.warn("🔕 알림 권한 거부됨");
                    return;
                }
            }

            // 2. Firestore에서 알림 시간 목록 가져오기
            if (!auth.currentUser) return;
            const ref = doc(db, "users", auth.currentUser.uid, "settings", "notification");
            const snap = await getDoc(ref);
            const hours: number[] = snap.exists() ? snap.data().hours || [] : [];

            if (hours.length === 0) {
                console.log("⚠️ 예약할 알림 시간이 없습니다.");
                return;
            }

            // 3. 기존 예약 취소
            await Notifications.cancelAllScheduledNotificationsAsync();

            // 4. 알림 예약
            for (const hour of hours) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "🔥 유지어터 체크!",
                        body: "오늘도 식단/운동 완료하셨나요?",
                        data: {
                            dateKey: new Date().toISOString().slice(0, 10),
                        },
                    },
                    trigger: {
                        type: "daily",
                        hour,
                        minute: 0,
                        repeats: true,
                    } as Notifications.DailyTriggerInput,
                });
            }

            console.log(`✅ ${hours.length}개의 시간에 알림 예약 완료:`, hours);
        };

        scheduleDailyPush();
    }, [enabled]);
}