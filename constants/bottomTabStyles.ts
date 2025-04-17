// 📁 constants/journalStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "./Colors";
import { Platform } from 'react-native';
export const styles = StyleSheet.create({
    // ✅ main 화면

    bottomTabContainer: {
        // flex: 1,
        width: "105%",
        bottom: 0,
        borderColor: "#eee",
        paddingVertical: 10,
        backgroundColor: '#fff', // elevation은 배경색이 있어야 보임
        borderWidth: 1,
        elevation: 10, // 안드로이드 전용 그림자 깊이
        borderRadius: 30, // 모서리 둥글게 (선택)
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",          // 수평 중앙 정렬
    },

    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    bottomTabLabel: {
        fontSize: 14,
        textAlign: 'center',
        fontFamily: "Pretendard-Bold",
        marginTop: 2,
        color: Colors.light.text,
    },

    bottomTabIcon: {
        color: Colors.light.text,
    }

})