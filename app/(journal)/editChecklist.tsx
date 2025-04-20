// 파일: 프로젝트 경로: app/(journal)/editChecklist.tsx

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
import { auth, db } from "../../firebase/config";
import {
    collection,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { styles } from "../../constants/journalStyles";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type ChecklistItem = {
    title: string;
    checked: boolean;
};

export default function EditChecklistScreen() {
    const router = useRouter();
    const { journalId, period, goalType, currentValue, targetValue } = useLocalSearchParams();
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [newItem, setNewItem] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        const fetchChecklist = async () => {
            if (!journalId || !auth.currentUser) return;
            const ref = doc(db, "journals", journalId as string);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setChecklist(snap.data().checklist || []);
            }
        };
        fetchChecklist();
    }, [journalId]);

    const handleRemove = (index: number) => {
        const updated = [...checklist];
        updated.splice(index, 1);
        setChecklist(updated);
    };

    const handleAdd = () => {
        const trimmed = newItem.trim();
        if (trimmed.length === 0) return;
        setChecklist([...checklist, { title: trimmed, checked: false }]);
        setNewItem("");
    };

    const handleStartEdit = (index: number) => {
        setEditingIndex(index);
        setEditingText(checklist[index].title);
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditingText("");
    };

    const handleSaveEdit = () => {
        if (editingText.trim().length === 0 || editingIndex === null) return;
        const updated = [...checklist];
        updated[editingIndex].title = editingText.trim();
        setChecklist(updated);
        handleCancelEdit();
    };

    const handleSaveToFirestore = async () => {
        if (!auth.currentUser || !journalId) return;
        try {
            const ref = doc(db, "journals", journalId as string);
            await updateDoc(ref, {
                checklist,
                period: parseInt(period as string),
                goalType,
                currentValue: parseFloat(currentValue as string),
                targetValue: parseFloat(targetValue as string),
            });
            Alert.alert("저장 완료", "체크리스트가 성공적으로 저장되었습니다.");
            router.replace("/(journal)");
        } catch (err) {
            console.error("체크리스트 저장 실패:", err);
            Alert.alert("오류", "저장 중 문제가 발생했습니다.");
        }
    };

    return (
        <View style={styles.journalContainer}>
            <Text style={styles.title}>체크리스트 수정</Text>
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
                                <TouchableOpacity
                                    onPress={handleSaveEdit}
                                    style={styles.editSaveButton}
                                >
                                    <Text style={styles.editSaveText}>저장</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleCancelEdit}
                                    style={styles.editCancelButton}
                                >
                                    <Text style={styles.editCancelText}>취소</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.checkCard}>
                                <TouchableOpacity
                                    onPress={() => handleStartEdit(index)}
                                >
                                    <Text style={styles.checkCardText}>{item.title}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleRemove(index)}>
                                    <Ionicons
                                        name="trash-outline"
                                        size={20}
                                        style={styles.deleteIcon}
                                    />
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
                    keyboardType="default"
                    placeholderTextColor={Colors.light.primary}
                    style={styles.newInput}
                />
                <TouchableOpacity onPress={handleAdd}>
                    <Text style={styles.addCheckButton}>+</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.startButton}
                onPress={handleSaveToFirestore}
            >
                <Text style={styles.startButtonText}>체크리스트 저장</Text>
            </TouchableOpacity>
        </View>
    );
}
