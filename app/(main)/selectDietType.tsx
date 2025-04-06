import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors"; // Colors 임포트

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

            <Button
                title="다음"
                onPress={handleNext}
                disabled={!selected}
                color={selected ? Colors.light.tint : "#ccc"} // 선택된 상태일 때 버튼 색상
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.light.background, // 배경색 (auth와 동일하게 유지)
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
        color: Colors.light.tint, // 텍스트 색상 보라색
    },
    card: {
        padding: 16,
        backgroundColor: "#eee",
        borderRadius: 10,
        marginBottom: 12,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Pretendard-Bold",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    selectedCard: {
        backgroundColor: Colors.light.tint, // 선택된 카드의 색상 (보라색)
        borderColor: "#fff", // 선택된 카드 테두리 색상 (흰색)
        borderWidth: 2,
        elevation: 8, // 그림자 효과 (Android)
        shadowColor: "#000", // 그림자 색상 (iOS)
        shadowOffset: { width: 0, height: 4 }, // 그림자 위치
        shadowOpacity: 0.3, // 그림자 투명도
        shadowRadius: 4, // 그림자 크기
    },
    cardText: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.text, // 텍스트 색상 (진한 회색)
    },
    selectedText: {
        color: "#fff", // 선택된 카드의 텍스트 색상 (흰색)
    },
});