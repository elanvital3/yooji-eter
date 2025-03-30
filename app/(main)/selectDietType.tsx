// app/(main)/selectDietType.tsx
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

const dietOptions = [
    { key: "switch_on", label: "스위치온" },
    { key: "low_carb", label: "저탄고지" },
    { key: "vegetarian", label: "채식" },
];

export default function SelectDietTypeScreen() {
    const [selected, setSelected] = useState<string | null>(null);
    const router = useRouter();

    const handleNext = () => {
        if (selected) {
            router.push({
                pathname: "/(main)/inputStartWeight",
                params: { type: selected },
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>다이어트 유형을 선택해주세요</Text>

            {dietOptions.map((option) => (
                <TouchableOpacity
                    key={option.key}
                    style={[
                        styles.card,
                        selected === option.key && styles.selectedCard,
                    ]}
                    onPress={() => setSelected(option.key)}
                >
                    <Text style={styles.cardText}>{option.label}</Text>
                </TouchableOpacity>
            ))}

            <Button title="다음" onPress={handleNext} disabled={!selected} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 20, marginBottom: 20 },
    card: {
        padding: 16,
        backgroundColor: "#eee",
        borderRadius: 10,
        marginBottom: 12,
    },
    selectedCard: {
        backgroundColor: "#a5d6a7",
        borderColor: "#2e7d32",
        borderWidth: 2,
    },
    cardText: { fontSize: 16 },
});