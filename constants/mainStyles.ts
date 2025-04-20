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
        marginTop: "5%"
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



    // ✅ 상단메뉴
    nickName: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.text, // 기본 텍스트 색상
    },
    nickNameRow: {
        flexDirection: "row", // 가로로 배치
        alignItems: "center", // 세로 중앙 정렬
    },
    topDday: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.text, // 기본 텍스트 색상
    },
    topPoint: {
        flexDirection: "row", // 가로로 배치
        alignItems: "center", // 세로 중앙 정렬
        backgroundColor: Colors.light.lightGray,
        paddingHorizontal: 5,
        borderRadius: 10,

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
        left: 5,
        backgroundColor: Colors.light.background,
        elevation: 2, // 안드로이드 전용 그림자 깊이
        // borderWidth: 1,
        // borderColor: Colors.light.primary, // 메뉴의 테두리 색상
        borderRadius: 8,
        padding: 5,
        width: "auto",
        zIndex: 100,
        alignItems: "center",
    },
    topMenu1: {
        paddingVertical: 4,
        paddingHorizontal: 4,
        // borderBottomWidth: 1,
        // backgroundColor: Colors.light.background,
        zIndex: 100,
        // borderColor: Colors.light.primary, // 항목 사이의 구분선
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
        justifyContent: 'center',
        alignItems: "center",
        marginBottom: 10,
    },
    dayRow: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
    },
    dateBox: {
        width: 50,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.light.lightGray,
        position: 'relative', // ⭐️ 추가해줘야 위치 기준이 됨
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
    starBadge: {
        position: 'absolute',
        top: -10,      // 살짝 더 위로
        right: -5,    // 박스 밖으로 조금 튀어나오게
        fontSize: 14, // 또는 16
        zIndex: 10,   // 다른 요소 위로 뜨게
    },

    selectedDateText: {
        color: '#FFF',
        fontFamily: "Pretendard-Bold",
    },
    dateArrow: {
        fontSize: 16,
        color: Colors.light.text,
        paddingHorizontal: 10,
    },

    // ✅ 상태진행바
    progressBarContainer: {
        width: '100%',       // ✅ 추가
        marginTop: 12,
        alignItems: 'center',
    },

    progressBarBackground: {
        width: '100%',
        height: 24, // ✅ 기존보다 키움
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center', // ✅ 텍스트 수직 가운데 정렬
    },

    progressBarFilled: {
        height: '100%',
        backgroundColor: Colors.light.primary,
        position: 'absolute',
        left: 0,
        top: 0,
        borderRadius: 10,
    },

    progressBarTextWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: "Pretendard-Bold",
        color: '#FFF', // ✅ 바 위에 보이게 하얀 글자
    },

    // ✅ check list 화면
    checkListContainer: { gap: 10, width: "100%", marginTop: 10, }, // 간격 좁힘
    itemRow: {
        elevation: 2, // 안드로이드 전용 그림자 깊이
        backgroundColor: '#fff', // elevation은 배경색이 있어야 보임
        borderRadius: 10, // 모서리 둥글게 (선택)
        justifyContent: "space-between",
        flexDirection: "row",
        padding: 8, // 간격 좁힘
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    itemText: {
        fontSize: 16,
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

    // ✅ 현재값 입력    

    goalContainer: {
        width: "100%",
        marginTop: 10,
    },
    goalLabel: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        marginBottom: 6,
        color: Colors.light.text,
        alignSelf: "flex-start"
    },
    goalInput: {
        borderWidth: 1,
        borderColor: Colors.light.gray,
        borderRadius: 8,
        padding: 8,
        flex: 1
    },

    goalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    savebutton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: Colors.light.primary,
        borderRadius: 8
    },

    saveText: {
        color: 'white',
        fontFamily: "Pretendard-Bold",
    }





});