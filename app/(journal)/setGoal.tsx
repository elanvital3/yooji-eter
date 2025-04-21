// 📁 app/(journal)/setGoal.tsx
import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { styles } from "../../constants/journalStyles";

export default function SetGoalScreen() {
    const [title, setTitle] = useState<string>(""); // ✅ 저널 이름 추가
    const [period, setPeriod] = useState<string>("");
    const [goalType, setGoalType] = useState<"weight" | "bodyFat" | "muscle">("weight");
    const [currentValue, setCurrentValue] = useState<string>("");
    const [targetValue, setTargetValue] = useState<string>("");
    const router = useRouter();

    const isDisabled = !title || !period || !currentValue || !targetValue;

    const handleNext = () => {
        router.push({
            pathname: "/(journal)/createChecklist",
            params: {
                title, // ✅ 함께 넘기기
                period,
                goalType,
                currentValue,
                targetValue,
            },
        });
    };

    return (
        <View style={styles.journalContainer}>
            <Text style={styles.label}>챌린지 이름</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="예: 스위치온 4주 챌린지"
            />

            <Text style={styles.label}>챌린지 기간 (일)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={period}
                onChangeText={setPeriod}
                placeholder="예: 30"
            />

            <Text style={styles.label}>목표 지표</Text>
            <View style={styles.radioRow}>
                <TouchableOpacity
                    onPress={() => setGoalType("weight")}
                    style={[styles.radioButton, goalType === "weight" && styles.radioSelected]}>
                    <Text style={[styles.radioText, goalType === "weight" && styles.selectedText]}>체중</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setGoalType("bodyFat")}
                    style={[styles.radioButton, goalType === "bodyFat" && styles.radioSelected]}>
                    <Text style={[styles.radioText, goalType === "bodyFat" && styles.selectedText]}>체지방률</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setGoalType("muscle")}
                    style={[styles.radioButton, goalType === "muscle" && styles.radioSelected]}>
                    <Text style={[styles.radioText, goalType === "muscle" && styles.selectedText]}>근골격량</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>현재 값 ({goalType === "bodyFat" ? "%" : "kg"})</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={currentValue}
                onChangeText={setCurrentValue}
                placeholder={`예: ${goalType === "bodyFat" ? "18" : "86"}`}
            />

            <Text style={styles.label}>목표 값 ({goalType === "bodyFat" ? "%" : "kg"})</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={targetValue}
                onChangeText={setTargetValue}
                placeholder={`예: ${goalType === "bodyFat" ? "15" : "80"}`}
            />

            <TouchableOpacity onPress={handleNext} disabled={isDisabled}>
                <Text style={[styles.buttonText, isDisabled && styles.disabledText]}>
                    다음
                </Text>
            </TouchableOpacity>
        </View>
    );
}