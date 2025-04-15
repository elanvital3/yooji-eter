// 📁 app/_layout.tsx
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { usePushToken } from "../hooks/usePushNotifications";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useCurrentJournalId } from "../hooks/useCurrentJournalId";
import { doc, setDoc, query, where, getDocs, collection } from "firebase/firestore";
import { auth, db } from "../firebase/config";

// ✅ 앱이 foreground(열려 있을 때)에도 알림 UI 띄우도록 설정
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.ttf"),
    "Pretendard": require("../assets/fonts/Pretendard-Regular.ttf"),
  });

  const token = usePushToken();
  const user = useCurrentUser(); // 👉 uid 확인 가능
  const journalId = useCurrentJournalId(); // 👉 자동 연동된 유지일기 ID

  // ✅ 폰트 로딩 완료되면 스플래시 숨기기
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // ✅ 푸시 토큰 확인
  useEffect(() => {
    if (token) {
      console.log("✅ 알림 토큰:", token);
    }
  }, [token]);

  // ✅ 알림 클릭 시 체크리스트 자동 완료
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const data = response.notification.request.content.data;
        const dateKey = data.dateKey;

        const uid = auth.currentUser?.uid;
        if (!uid || !dateKey) return;

        try {
          // ✅ 1. 활성화된 유지일기 불러오기
          const q = query(
            collection(db, "journals"),
            where("userId", "==", uid),
            where("status", "==", "in_progress")
          );
          const snapshot = await getDocs(q);
          if (snapshot.empty) return;

          const journalDoc = snapshot.docs[0];
          const journalId = journalDoc.id;

          // ✅ 2. checklist 템플릿 불러오기
          const checklist = journalDoc.data().checklist || [];

          // ✅ 3. 모든 항목을 checked: true로 바꾸기
          const completedChecklist = checklist.map((item: any) => ({
            title: item.title,
            checked: true,
          }));

          // ✅ 4. 해당 날짜에 저장
          const ref = doc(db, `journals/${journalId}/dailyLogs/${dateKey}`);
          await setDoc(ref, {
            checklist: completedChecklist,
            completedAt: new Date(),
          });

          console.log(`✅ 알림 클릭 → ${dateKey} 체크리스트 자동 완료됨`);
        } catch (err) {
          console.error("❌ 알림 처리 중 오류:", err);
        }
      }
    );

    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return <Slot />;
}