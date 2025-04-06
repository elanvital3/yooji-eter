// 📁 app/(auth)/_layout.tsx
import { Slot } from "expo-router";
import { Image, View, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors"

export default function AuthLayout() {
    return (
        <View style={styles.container}>
            {/* 🐰 공통 캐릭터 */}
            <Image
                source={require("../../assets/images/mainCharacter.png")}
                style={styles.character}
            />

            {/* 👇 아래쪽 페이지 내용 */}
            <Slot />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 100, // 위에 공간 줘서 캐릭터 띄우기
    },
    character: {
        width: 180,
        height: 180,
        resizeMode: "contain",
        marginBottom: 24,
    },
});