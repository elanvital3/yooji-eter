// 📁 hooks/useDailyPushNotification.ts
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export function useDailyPushNotification(enabled: boolean) {
    useEffect(() => {
        if (!enabled) return;

        const scheduleDailyPush = async () => {
            const permission = await Notifications.getPermissionsAsync();
            if (!permission.granted) {
                const request = await Notifications.requestPermissionsAsync();
                if (!request.granted) {
                    console.warn("🔕 알림 권한 거부됨");
                    return;
                }
            }

            // 📅 오늘 20시로 알림 예약
            const now = new Date();
            const scheduledTime = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                20, 0, 0
            );
            if (scheduledTime < now) {
                scheduledTime.setDate(scheduledTime.getDate() + 1);
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "🔥 유지어터 체크!",
                    body: "오늘도 식단/운동 완료하셨나요?",
                    data: {
                        dateKey: scheduledTime.toISOString().slice(0, 10),
                    },
                },
                trigger: {
                    type: "daily",
                    hour: 20,
                    minute: 0,
                } as Notifications.DailyTriggerInput, // ✅ 여기까지 명시해줘야 타입 인식 OK
            });

            console.log("✅ 매일 20시 알림 예약 완료");
        };

        scheduleDailyPush();
    }, [enabled]);
}