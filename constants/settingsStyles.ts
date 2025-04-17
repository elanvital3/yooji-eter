// 📁 constants/settingsStyles.ts
import { StyleSheet } from "react-native";
import { Colors } from "./Colors";
import { Platform } from 'react-native';

export const styles = StyleSheet.create({
    mainContainer: {
        // flex: 1,
        // flexGrow: 0,
        // justifyContent: "flex-start",
        padding: 10,
        borderColor: "#eee",
        paddingVertical: 10,
        backgroundColor: '#fff', // elevation은 배경색이 있어야 보임
        borderWidth: 1,
        elevation: 4, // 안드로이드 전용 그림자 깊이
        borderRadius: 10, // 모서리 둥글게 (선택)
        // alignSelf: "flex-start"
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.text,
    },

    hourGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 5,
        marginTop: 10,
    },

    hourBox: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },

    hourBoxSelected: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },

    hourText: {
        color: Colors.light.text,
        fontFamily: "Pretendard",
    },

    hourTextSelected: {
        color: "#fff",
        fontFamily: "Pretendard-Bold",
    },
});