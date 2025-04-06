import { StyleSheet } from "react-native";
import { Colors } from "./Colors";  // Colors.ts에서 색상 가져오기

export const commonStyles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 24,
        backgroundColor: Colors.light.background, // 배경색
    },
    title: {
        fontSize: 20,
        marginBottom: 12,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
        color: Colors.light.text, // 글씨 색상
    },
    input: {
        fontFamily: "Pretendard-Bold",
        width: "100%",
        borderWidth: 1,
        borderColor: Colors.light.tint, // 테두리 색상
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    loginButton: {
        color: Colors.light.tint, // 버튼 텍스트 색상
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
    },
});