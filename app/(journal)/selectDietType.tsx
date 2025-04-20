// 📁 app/(journal)/selectDietType.tsx
import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { styles } from "../../constants/journalStyles";

const dietOptions = [
    { key: "switch_on", label: "스위치온" },
    { key: "low_carb", label: "저탄고지" },
    { key: "vegetarian", label: "채식" },
];

export default function SelectDietTypeScreen() {
    const [selected, setSelected] = useState<string | null>(null);
    const router = useRouter();

    const {
        title,           // ✅ 추가
        period,
        goalType,
        currentValue,
        targetValue
    } = useLocalSearchParams();

    const handleNext = () => {
        if (selected) {
            router.push({
                pathname: "/(journal)/createChecklist",
                params: {
                    title: title?.toString(), // ✅ 추가
                    type: selected,
                    period: period?.toString(),
                    goalType: goalType?.toString(),
                    currentValue: currentValue?.toString(),
                    targetValue: targetValue?.toString(),
                },
            });
        }
    };

    return (
        <View style={styles.journalContainer}>
            <Text style={styles.title}>다이어트 유형을 선택해주세요</Text>

            {dietOptions.map((option) => (
                <TouchableOpacity
                    key={option.key}
                    style={[
                        styles.journalCard,
                        selected === option.key && styles.selectedCard,
                    ]}
                    onPress={() => setSelected(option.key)}
                >
                    <Text
                        style={[
                            styles.cardText,
                            selected === option.key && styles.selectedText,
                        ]}
                    >
                        {option.label}
                    </Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={handleNext} disabled={!selected}>
                <Text style={[styles.buttonText, !selected && styles.disabledText]}>다음</Text>
            </TouchableOpacity>
        </View>
    );
}