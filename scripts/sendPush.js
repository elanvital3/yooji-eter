// 📁 scripts/sendPush.js
const fetch = require("node-fetch");

const sendPush = async () => {
  const token = "ExponentPushToken[qfHDEUDjLsF8LmQuco74F3]";

  const message = {
    to: token,
    sound: "default",
    title: "📅 유지어터 체크!",
    body: "운동과 식단 체크 완료하시겠어요?",
    data: {
      action: "check_complete",
      dateKey: "2025-04-16", // 👉 오늘 날짜로 맞춰줘
    },
  };

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  const result = await res.json();
  console.log("✅ 알림 전송 결과:", result);
};

sendPush();