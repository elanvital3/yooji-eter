// 📁 constants/mainStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "./Colors";
import { Platform } from 'react-native';
export const styles = StyleSheet.create({
    // 일기 관련 스타일
    journalContainer: {
        width: "100%",
        flexGrow: 0,
    },

    journalCard: {
        flexDirection: "row",
        backgroundColor: Colors.light.lightGray,  // 카드 배경 색상 수정
        padding: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.light.gray,
        marginBottom: 12, // 카드 간격 줄임
        // overflow: 'hidden', // 이 부분을 추가해줍니다.
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                // elevation: 4,
                // shadowColor: '#000',
                // shadowOffset: { width: 0, height: 4 }, // 더 큰 그림자 효과
                // shadowOpacity: 0.25, // 그림자 투명도
                // shadowRadius: 4, // 그림자 크기
            },
            web: {
                boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.1)",  // 웹에서는 boxShadow 사용
            },
        }),
    },
    journalType: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Pretendard",
        color: Colors.light.primary,
    },
    dDay: {
        fontSize: 14,
        color: Colors.light.gray, // 회색 D-Day
        // fontFamily: "Pretendard-Bold",
    },
    icon: {
        marginRight: 10,
        marginTop: 5,
        color: Colors.light.primary
    },
    title: {
        fontSize: 20,
        marginBottom: 12,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
        color: Colors.light.text, // 기본 텍스트 색상
    },
    // 버튼 스타일
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

    // 카드 스타일
    card: {
        padding: 16,
        backgroundColor: Colors.light.subColor,
        borderRadius: 8,
        marginBottom: 6,
        width: "100%",
        alignItems: "center",
        fontFamily: "Pretendard-Bold",
        borderWidth: 1,
        borderColor: Colors.light.primary, // 기본 테두리 색상
    },
    cardText: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.text, // 기본 텍스트 색상 (진한 회색)
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



    // 체중입력
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



    // 체크리스트 항목 스타일    
    cardContainer: {
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
    deleteText: {
        fontSize: 12,
        color: "red",
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
        color: "green",
        fontFamily: "Pretendard-Bold",
    }
});