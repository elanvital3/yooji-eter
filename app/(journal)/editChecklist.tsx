// 📁 app/(journal)/editChecklist.tsx

import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth, db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp, where, query, getDocs } from "firebase/firestore";
import { styles } from "../../constants/journalStyles";  // 공통 스타일 임포트
import { Colors } from "../../constants/Colors"; // Colors 임포트

const CHECKLIST_PRESETS: Record<string, string[]> = {
    switch_on: [
        "운동",
        "저녁 무탄수 식단",
        "금주",
        "공복 14시간",
        "액상과당 섭취 X",
        "물 2L 섭취",
        "밀가루, 튀김음식 섭취 X",
        "7시간 숙면",
    ],
    low_carb: [
        "탄수화물 20g 이하",
        "지방 위주 식단",
        "공복 16시간",
        "스트레칭 10분 이상",
    ],
    vegetarian: [
        "육류 섭취 X",
        "야채 위주 식단",
        "탄수화물 균형 유지",
        "유제품 적당량 섭취",
    ],
};

export default function EditChecklistScreen() {
    const router = useRouter();
    const { type, startWeight } = useLocalSearchParams();
    const [checklist, setChecklist] = useState<string[]>([]);
    const [newItem, setNewItem] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        const initial = CHECKLIST_PRESETS[type as string] || [];
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
        if (!user || !type || !startWeight) {
            Alert.alert("정보 누락", "모든 필수 정보를 확인해주세요.");
            return;
        }

        try {
            // ✅ 기존 활성화된 저널이 있는지 확인
            const q = query(
                collection(db, "journals"),
                where("userId", "==", user.uid),
                where("status", "==", "in_progress")
            );
            const snapshot = await getDocs(q);
            const alreadyActive = !snapshot.empty;

            // ✅ 새로 만들 저널 데이터 구성
            const data = {
                userId: user.uid,
                type,
                startWeight: parseFloat(startWeight as string),
                startedAt: serverTimestamp(),
                status: alreadyActive ? "inactive" : "in_progress",
                checklist: checklist.map((title) => ({ title, checked: false })),
            };

            // ✅ Firestore에 저장
            await addDoc(collection(db, "journals"), data);
            router.replace("/(journal)");
        } catch (err) {
            console.error("Firestore 저장 오류:", err);
            Alert.alert("오류", "저장 중 문제가 발생했습니다.");
        }
    };

    return (
        <View style={styles.journalContainer}>
            <Text style={styles.title}>체크리스트를 수정해주세요</Text>
            <FlatList
                data={checklist}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.cardContainer}>
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
                                {/* 텍스트를 클릭하면 수정 모드로 들어가도록 수정 */}
                                <TouchableOpacity onPress={() => handleStartEdit(index)}>
                                    <Text style={styles.checkCardText}>{item}</Text>
                                </TouchableOpacity>
                                {/* 삭제 아이콘을 카드 밖으로 배치 */}
                                <TouchableOpacity onPress={() => handleRemove(index)} >
                                    <Text style={styles.deleteText}>❌</Text>
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
                    keyboardType="default"  // 기본 키보드 설정
                    placeholderTextColor={Colors.light.primary}
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