// 📁 app/(journal)/editGoal.tsx

import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { styles } from "../../constants/journalStyles";

export default function EditGoalScreen() {
    const { journalId } = useLocalSearchParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [type, setType] = useState<string>("switch_on");
    const [period, setPeriod] = useState<string>("");
    const [goalType, setGoalType] = useState<"weight" | "bodyFat" | "muscle">("weight");
    const [currentValue, setCurrentValue] = useState<string>("");
    const [targetValue, setTargetValue] = useState<string>("");

    const isDisabled = !period || !currentValue || !targetValue;

    useEffect(() => {
        const fetchGoalData = async () => {
            if (!journalId) return;
            const ref = doc(db, "journals", journalId as string);
            const snap = await getDoc(ref);
            if (!snap.exists()) return;

            const data = snap.data();
            setType(data.type || "switch_on");
            setPeriod(data.period?.toString() || "");
            setGoalType(data.goalType || "weight");
            setCurrentValue(data.currentValue?.toString() || "");
            setTargetValue(data.targetValue?.toString() || "");
            setLoading(false);
        };
        fetchGoalData();
    }, [journalId]);

    const handleNext = () => {
        router.push({
            pathname: "/(journal)/editChecklist",
            params: {
                journalId,
                type,
                period,
                goalType,
                currentValue,
                targetValue,
            },
        });
    };

    if (loading) return <ActivityIndicator size="large" />;

    return (
        <View style={styles.journalContainer}>
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
                    style={[styles.radioButton, goalType === "weight" && styles.radioSelected]}
                >
                    <Text style={[styles.radioText, goalType === "weight" && styles.selectedText]}>체중</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setGoalType("bodyFat")}
                    style={[styles.radioButton, goalType === "bodyFat" && styles.radioSelected]}
                >
                    <Text style={[styles.radioText, goalType === "bodyFat" && styles.selectedText]}>체지방률</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setGoalType("muscle")}
                    style={[styles.radioButton, goalType === "muscle" && styles.radioSelected]}
                >
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
                <Text style={[styles.buttonText, isDisabled && styles.disabledText]}>다음</Text>
            </TouchableOpacity>
        </View>
    );
}