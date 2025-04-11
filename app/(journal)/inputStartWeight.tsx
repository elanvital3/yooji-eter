// 📁 app/(main)/inputStartWeight.tsx
import { View, Text, TextInput, Button, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { styles } from "../../constants/journalStyles";  // 공통 스타일 임포트

export default function InputStartWeightScreen() {
    const [weight, setWeight] = useState("");
    const router = useRouter();
    const { type } = useLocalSearchParams();

    const handleNext = () => {
        const parsedWeight = parseFloat(weight);
        if (isNaN(parsedWeight) || parsedWeight <= 0) {
            Alert.alert("몸무게를 올바르게 입력해주세요");
            return;
        }

        // 👉 다음 화면(예: optional body info)으로 이동
        router.push({
            pathname: "/(journal)/editChecklist",
            params: {
                type: type as string,
                startWeight: weight,
            },
        });
    };

    return (
        <View style={styles.journalContainer}>
            <Text style={styles.title}>시작 몸무게를 입력해주세요 (kg)</Text>

            <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="예: 67.5"
                style={styles.input}
            />

            {/* <Button
                title="다음"
                onPress={handleNext}
                disabled={!weight}
                color={weight ? Colors.light.tint : "#ccc"} // 보라색 버튼
            /> */}
            <TouchableOpacity onPress={handleNext} disabled={!weight}>
                <Text style={[styles.buttonText, !weight && styles.disabledText]}>다음</Text>
            </TouchableOpacity>

        </View>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: Colors.light.background, // 배경색
//     },
//     title: {
//         fontSize: 18,
//         marginBottom: 16,
//         fontFamily: "Pretendard-Bold",
//         textAlign: "center",
//         color: Colors.light.tint, // 보라색 텍스트
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: Colors.light.tint, // 보라색 테두리
//         borderRadius: 8,
//         padding: 12,
//         marginBottom: 20,
//         fontFamily: "Pretendard-Bold",
//     },
// });