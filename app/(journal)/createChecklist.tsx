// 📁 app/(journal)/createChecklist.tsx

import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styles } from "../../constants/journalStyles";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

export default function CreateChecklistScreen() {
    const router = useRouter();
    const { type, period, goalType, currentValue, targetValue, title } = useLocalSearchParams();

    const [checklist, setChecklist] = useState<string[]>([]);
    const [newItem, setNewItem] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");

    const preset: Record<string, string[]> = {
        switch_on: ["운동", "저녁 무탄수 식단", "금주", "공복 14시간", "액상과당 섭취 X", "물 2L 섭취", "밀가루, 튀김음식 섭취 X", "7시간 숙면"],
        low_carb: ["탄수화물 20g 이하", "지방 위주 식단", "공복 16시간", "스트레칭 10분 이상"],
        vegetarian: ["육류 섭취 X", "야채 위주 식단", "탄수화물 균형 유지", "유제품 적당량 섭취"]
    };

    useEffect(() => {
        const initial = preset[type as string] || [];
        setChecklist(initial);
    }, [type]);

    const handleRemove = (index: number) => {
        const updated = [...checklist];
        updated.splice(index, 1);
        setChecklist(updated);
    };

    const handleAdd = () => {
        const trimmed = newItem.trim();
        if (trimmed.length === 0) return;
        setChecklist([...checklist, trimmed]);
        setNewItem("");
    };

    const handleStartEdit = (index: number) => {
        setEditingIndex(index);
        setEditingText(checklist[index]);
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditingText("");
    };

    const handleSaveEdit = () => {
        if (editingText.trim().length === 0) return;
        const updated = [...checklist];
        updated[editingIndex!] = editingText.trim();
        setChecklist(updated);
        handleCancelEdit();
    };

    const handleCreate = async () => {
        const user = auth.currentUser;


        console.log("🔥 Create Params 확인:");
        console.log("title:", title); // 🔥 디버깅 확인
        console.log("user:", user?.uid);
        console.log("type:", type);
        console.log("period:", period);
        console.log("goalType:", goalType);
        console.log("currentValue:", currentValue);
        console.log("targetValue:", targetValue);
        console.log("checklist:", checklist);

        if (
            !user ||
            !type ||
            !period ||
            !goalType ||
            !currentValue ||
            !targetValue ||
            !title // 👈 추가 체크
        ) {
            Alert.alert("오류", "필수 정보가 누락되었습니다.");
            return;
        }

        try {
            // 현재 활성화된 저널이 있는지 확인
            const q = query(
                collection(db, "journals"),
                where("userId", "==", user.uid),
                where("status", "==", "in_progress")
            );
            const snapshot = await getDocs(q);
            const alreadyActive = !snapshot.empty;

            // 저장할 데이터 구성
            const docData = {
                userId: user.uid,
                title: title.toString(), // 👈 여기 추가
                type,
                checklist: checklist.map((title) => ({ title, checked: false })),
                status: alreadyActive ? "inactive" : "in_progress",
                startedAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
                period: parseInt(period as string),
                goalType,
                currentValue: parseFloat(currentValue as string),
                targetValue: parseFloat(targetValue as string),
            };

            await addDoc(collection(db, "journals"), docData);
            router.replace("/(journal)");
        } catch (err) {
            console.error("저장 실패:", err);
            Alert.alert("오류", "유지일기 저장 중 문제가 발생했습니다.");
        }
    };

    return (
        <View style={styles.journalContainer}>
            <Text style={styles.title}>체크리스트를 수정해주세요</Text>
            <FlatList
                data={checklist}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.checkListRow}>
                        {editingIndex === index ? (
                            <View style={styles.editRow}>
                                <TextInput
                                    style={styles.editInput}
                                    value={editingText}
                                    onChangeText={setEditingText}
                                />
                                <TouchableOpacity onPress={handleSaveEdit} style={styles.editSaveButton}>
                                    <Text style={styles.editSaveText}>저장</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleCancelEdit} style={styles.editCancelButton}>
                                    <Text style={styles.editCancelText}>취소</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.checkCard}>
                                <TouchableOpacity onPress={() => handleStartEdit(index)}>
                                    <Text style={styles.checkCardText}>{item}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleRemove(index)}>
                                    <Ionicons name="trash-outline" size={20} style={styles.deleteIcon} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            />
            <View style={styles.addRow}>
                <TextInput
                    value={newItem}
                    onChangeText={setNewItem}
                    placeholder="추가하기"
                    placeholderTextColor="gray"
                    style={styles.newInput}
                />
                <TouchableOpacity onPress={handleAdd}>
                    <Text style={styles.addCheckButton}>+</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.startButton} onPress={handleCreate}>
                <Text style={styles.startButtonText}>유지일기 시작하기</Text>
            </TouchableOpacity>
        </View>
    );
}