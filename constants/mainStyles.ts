// 📁 constants/mainStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // backgroundColor: Colors.light.,
        justifyContent: "space-between",  // 캐릭터가 화면 상단에 오도록
        alignItems: "center",          // 수평 중앙 정렬
        paddingHorizontal: 24,
        marginTop: "10%"
        // paddingTop: "50%",                // 캐릭터 위쪽 공간을 늘려 캐릭터를 더 상단에 배치
    },
    topContainer: {
        flexDirection: "row", // 가로로 배치
        width: "100%",
        justifyContent: "space-between", // 왼쪽과 오른쪽에 간격을 둠
        alignItems: "center", // 세로 중앙 정렬
        // paddingHorizontal: 24, // 양 옆에 여백을 둠
        // paddingTop: 10, // 상단 여백
    },
    topDate: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.text, // 기본 텍스트 색상
    },
    topPoint: {
        flexDirection: "row", // 가로로 배치
        alignItems: "center", // 세로 중앙 정렬
    },
    pointText: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.primary, // 포인트 색상
        // marginRight: 5,
    },
    menuText: {
        fontSize: 22,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.text, // 점 3개 색상
    },
    dropdownMenu: {
        position: "absolute",
        top: 30, // 메뉴가 점 3개 아래로 펼쳐짐
        right: 5,
        backgroundColor: Colors.light.background,
        borderWidth: 1,
        borderColor: Colors.light.primary, // 메뉴의 테두리 색상
        borderRadius: 4,
        padding: 5,
        width: "auto",
        zIndex: 100,
        alignItems: "center",
    },
    topMenu1: {
        paddingVertical: 4,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        backgroundColor: Colors.light.background,
        zIndex: 100,
        borderColor: Colors.light.primary, // 항목 사이의 구분선
    },
    topMenu2: {
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    menuDetail: {
        fontSize: 14,
        fontFamily: "Pretendard",
        color: Colors.light.primary, // 점 3개 색상
    },
    subContainer: {
        flex: 1,
        backgroundColor: Colors.light.background,
        alignItems: "center",          // 수평 중앙 정렬
        marginTop: 10,
        width: "100%",
    },
    bottomContainer: {
        // flex: 1,
        // backgroundColor: Colors.light.info,
        width: "100%",
        height: 30,
        alignItems: "center",          // 수평 중앙 정렬
    },



});