// 📁 constants/mainStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

export const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.light.background,
        justifyContent: "space-between",  // 캐릭터가 화면 상단에 오도록
        alignItems: "center",          // 수평 중앙 정렬
        paddingHorizontal: 12,
        // marginTop: "10%"
        // paddingTop: "50%",                // 캐릭터 위쪽 공간을 늘려 캐릭터를 더 상단에 배치
    },
    topContainer: {
        flexDirection: "row", // 가로로 배치
        width: "100%",
        justifyContent: "space-between", // 왼쪽과 오른쪽에 간격을 둠
        alignItems: "center", // 세로 중앙 정렬
        // backgroundColor: Colors.light.primary,
        // paddingHorizontal: 24, // 양 옆에 여백을 둠
        // paddingTop: 10, // 상단 여백
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
        backgroundColor: Colors.light.info,
        width: "100%",
        height: 30,
        alignItems: "center",          // 수평 중앙 정렬
    },

    // ✅ 상단메뉴
    topDate: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.text, // 기본 텍스트 색상
    },
    topDday: {
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
        fontSize: 20,
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



    // ✅ main 달력    
    weekRow: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
    },
    dateBox: {
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: Colors.light.lightGray,
        paddingHorizontal: 5,
    },

    selectedDateBox: {
        backgroundColor: Colors.light.primary,
        color: "#FFFFFF"
    },
    dateText: {
        fontSize: 14,
        fontFamily: "Pretendard",
    },
    dateSubText: {
        fontSize: 14,
        fontFamily: "Pretendard",
    },

    selectedDateText: {
        color: '#FFF',
        fontFamily: "Pretendard-Bold",
    },
    dateArrow: {
        fontSize: 16,
        color: Colors.light.text,
    },

    // ✅ main 화면

    checkListContainer: { gap: 10, width: "100%", marginTop: 10, }, // 간격 좁힘
    itemRow: {
        elevation: 2, // 안드로이드 전용 그림자 깊이
        backgroundColor: '#fff', // elevation은 배경색이 있어야 보임
        borderRadius: 10, // 모서리 둥글게 (선택)
        justifyContent: "space-between",
        flexDirection: "row",
        padding: 10, // 간격 좁힘
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    itemText: {
        fontSize: 18,
        color: Colors.light.text,
        fontFamily: "Pretendard-Bold",
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12, // 완전한 원
        borderWidth: 2,
        borderColor: Colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },

    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.light.primary,
    },




});