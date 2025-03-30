// 📁 파일 경로: app/(main)/inputStartWeight.tsx
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

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
            pathname: "/(main)/editChecklist",
            params: {
                type: type as string,
                startWeight: weight,
            },
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>시작 몸무게를 입력해주세요 (kg)</Text>

            <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="예: 67.5"
                style={styles.input}
            />

            <Button title="다음" onPress={handleNext} disabled={!weight} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 18, marginBottom: 16 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
    },
});