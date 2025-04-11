// 📁 constants/styles.ts
import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

export const styles = StyleSheet.create({
    // 공통 스타일
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: "center",  // 캐릭터가 화면 상단에 오도록
        alignItems: "center",          // 수평 중앙 정렬
        paddingHorizontal: 24,
        // paddingTop: "50%",                // 캐릭터 위쪽 공간을 늘려 캐릭터를 더 상단에 배치
    },
    subContainer: {
        flex: 1,
        width: "100%",  // 슬롯의 너비를 100%로 설정
        // justifyContent: "flex-start", // 내용이 상단에 위치
        // alignItems: "center",         // 내용이 수평 중앙 정렬
        paddingTop: 20,               // 이메일 입력란 위쪽 여백 추가
    },
    character: {
        width: 150,
        height: 150,
        resizeMode: "contain",
        marginTop: '30%',
    },
    title: {
        fontSize: 20,
        marginBottom: 12,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
        color: Colors.light.text, // 기본 텍스트 색상
    },
    input: {
        fontFamily: "Pretendard-Bold",
        borderWidth: 1,
        borderColor: Colors.light.primary, // 테두리 색상
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    buttonText: {
        color: Colors.light.primary, // 버튼 텍스트 색상
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
    },

});