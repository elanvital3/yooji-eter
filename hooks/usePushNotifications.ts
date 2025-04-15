// 📁 hooks/usePushNotifications.ts
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import * as Device from 'expo-device';

export function usePushToken() {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

    useEffect(() => {
        const registerForPushNotifications = async () => {
            if (!Device.isDevice) {
                console.log("알림은 실제 디바이스에서만 작동합니다.");
                return;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log("알림 권한 거부됨");
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoPushToken(token);
            console.log("✅ Expo Push Token:", token);
        };

        registerForPushNotifications();
    }, []);

    return expoPushToken;
}