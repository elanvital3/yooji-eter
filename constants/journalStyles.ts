// 📁 constants/journalStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "./Colors";
import { Platform } from 'react-native';
export const styles = StyleSheet.create({
    // ✅ main 화면
    mainContainer: {
        flex: 1,
        // backgroundColor: Colors.light.,
        justifyContent: "space-between",  // 캐릭터가 화면 상단에 오도록
        alignItems: "center",          // 수평 중앙 정렬
        paddingHorizontal: 12,
        marginTop: "10%"
        // paddingTop: "50%",                // 캐릭터 위쪽 공간을 늘려 캐릭터를 더 상단에 배치
    },
    topContainer: {
        flexDirection: "row", // 가로로 배치
        width: "100%",
        // justifyContent: "space-between", // 왼쪽과 오른쪽에 간격을 둠
        alignItems: "center", // 세로 중앙 정렬
        // paddingHorizontal: 24, // 양 옆에 여백을 둠
        // paddingTop: 10, // 상단 여백
    },
    nickName: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.text, // 기본 텍스트 색상
    },

    menuText: {
        fontSize: 22,
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

    // ✅ 일기 목록
    journalContainer: {
        width: "100%",
        flexGrow: 0,
    },
    journalRow: {
        flexDirection: "row",
        alignItems: "center"
    },

    journalCard: {
        flexDirection: "row",
        elevation: 2, // 안드로이드 전용 그림자 깊이
        backgroundColor: '#fff', // elevation은 배경색이 있어야 보임
        borderRadius: 10, // 모서리 둥글게 (선택)
        // backgroundColor: Colors.light.lightGray,  // 카드 배경 색상 수정
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 12, // 카드 간격 줄임     
    },
    bookIcon: {
        marginRight: 5,
        marginTop: 5,
        color: Colors.light.primary
    },
    journalType: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Pretendard",
        color: Colors.light.primary,
    },
    startDate: {
        fontSize: 14,
        color: Colors.light.text, // 회색 D-Day
        // fontFamily: "Pretendard-Bold",
    },


    // ✅ 토글관련
    controlRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        // marginLeft: 10,
    },
    deleteIcon: {
        color: Colors.light.text,
    },




    // 버튼 스타일
    title: {
        fontSize: 20,
        marginBottom: 12,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
        color: Colors.light.text, // 기본 텍스트 색상
    },
    startButton: {
        backgroundColor: Colors.light.primary, // 버튼 배경색
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        // marginTop: 20,
    },
    startButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
    },

    // 선택된 다이어트 카드 스타일
    selectedCard: {
        backgroundColor: Colors.light.primary, // 선택된 카드의 색상
        borderColor: Colors.light.primary, // 기본 테두리 색상
        borderWidth: 1,
    },
    selectedText: {
        color: "#fff", // 선택된 카드의 텍스트 색상 (흰색)
    },

    // ✅ 다이어트 타입    
    cardText: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.text, // 기본 텍스트 색상 (진한 회색)
    },


    // ✅ 체중입력
    buttonText: {
        color: Colors.light.primary, // 버튼 텍스트 색상
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
    },
    disabledText: {
        color: Colors.light.gray, // 버튼 텍스트 색상
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
    },
    input: {
        fontFamily: "Pretendard-Bold",
        width: "100%", // 최대 너비
        borderWidth: 1,
        borderColor: Colors.light.primary, // 테두리 색상
        padding: 12,
        borderRadius: 8,
        marginBottom: 5,
    },


    // ✅ 체크리스트 항목 스타일   
    checkListRow: {
        width: "100%",
    },
    checkCard: {
        padding: 10,
        marginBottom: 6,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.light.primary,
    },
    checkCardText: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.text, // 텍스트 색상
    },



    // 체크리스트 수정 
    editRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        width: "100%", // 최대 너비
        borderBottomWidth: 1,
        borderColor: Colors.light.primary,
        marginBottom: 6,
        // justifyContent: "space-between",
    },
    editInput: {
        fontFamily: "Pretendard-Bold",
        fontSize: 16,
        padding: 10,
        color: Colors.light.text,
    },
    editSaveButton: {
        position: "absolute", // 카드 밖으로 위치시킬 수 있도록 절대 위치 지정
        right: 30, // 카드 오른쪽 밖에 배치        
    },
    editCancelButton: {
        position: "absolute", // 카드 밖으로 위치시킬 수 있도록 절대 위치 지정
        right: 0, // 카드 오른쪽 밖에 배치     
        // marginLeft: 4
    },
    editSaveText: {
        color: Colors.light.primary,
        fontFamily: "Pretendard-Bold",
    },
    editCancelText: {
        color: Colors.light.gray,
        fontFamily: "Pretendard-Bold",

    },

    editText: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.primary,
    },


    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: Colors.light.primary,
        marginBottom: 12,
    },
    itemText: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.primary,
    },
    // 수정용 입력 및 버튼 스타일

    addRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        // marginTop: 20,
        gap: 8,
        paddingBottom: 30, // 입력창과 버튼이 너무 밑에 있을 경우 위로 올리기 위한 패딩 추가
    },
    newInput: {
        fontFamily: "Pretendard-Bold",
        fontSize: 16,
        alignSelf: "center",
        width: "90%", // 최대 너비
        borderWidth: 1,
        borderColor: Colors.light.primary, // 테두리 색상
        // color: Colors.light.primary,        
        borderStyle: "dotted",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        marginBottom: 6,
    },
    addCheckButton: {
        fontSize: 30,
        color: Colors.light.primary,
        fontFamily: "Pretendard-Bold",
    }
});