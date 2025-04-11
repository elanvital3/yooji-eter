// 📁 app/(main)/selectDietType.tsx
import { View, Text, TouchableOpacity, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { styles } from "../../constants/journalStyles";  // 공통 스타일 임포트

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
                pathname: "/(journal)/inputStartWeight",
                params: { type: selected },
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
                        styles.card,
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