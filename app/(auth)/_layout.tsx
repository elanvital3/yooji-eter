// 📁 app/(auth)/_layout.tsx
import { Slot } from "expo-router";
import { Image, View } from "react-native";
import { styles } from "../../constants/authStyles";  // 공통 스타일 임포트

export default function AuthLayout() {
    return (
        <View style={styles.mainContainer}>
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