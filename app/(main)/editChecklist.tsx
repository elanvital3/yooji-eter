import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth, db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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

        const data = {
            userId: user.uid,
            type,
            startWeight: parseFloat(startWeight as string),
            startedAt: serverTimestamp(),
            status: "in_progress",
            checklist: checklist.map((title) => ({ title, checked: false })),
        };

        try {
            await addDoc(collection(db, "journals"), data);
            router.replace("/(main)");
        } catch (err) {
            console.error("Firestore 저장 오류:", err);
            Alert.alert("오류", "저장 중 문제가 발생했습니다.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>체크리스트를 수정해주세요</Text>

            <FlatList
                data={checklist}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.itemRow}>
                        {editingIndex === index ? (
                            <View style={styles.editRow}>
                                <TextInput
                                    style={styles.input}
                                    value={editingText}
                                    onChangeText={setEditingText}
                                />
                                <TouchableOpacity onPress={handleSaveEdit}>
                                    <Text style={styles.saveText}>저장</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleCancelEdit}>
                                    <Text style={styles.cancelText}>취소</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <Text style={styles.itemText}>{item}</Text>
                                <View style={{ flexDirection: "row", gap: 12 }}>
                                    <TouchableOpacity onPress={() => handleStartEdit(index)}>
                                        <Text style={styles.editText}>✏️</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleRemove(index)}>
                                        <Text style={styles.deleteText}>❌</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                )}
            />

            <View style={styles.addRow}>
                <TextInput
                    value={newItem}
                    onChangeText={setNewItem}
                    placeholder="새 항목 입력"
                    style={styles.input}
                />
                <Button title="추가" onPress={handleAdd} />
            </View>

            <Button title="유지일기 시작하기" onPress={handleCreate} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: Colors.light.background }, // 배경색
    title: {
        fontSize: 20,
        marginBottom: 16,
        fontFamily: "Pretendard-Bold",
        textAlign: "center",
        color: Colors.light.tint, // 보라색 텍스트
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: Colors.light.tint, // 보라색 테두리
        marginBottom: 12,
    },
    itemText: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.tint, // 보라색 텍스트
    },
    editText: {
        fontSize: 18,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.tint,
    },
    deleteText: { fontSize: 18, color: "red" },
    saveText: { color: "green", marginLeft: 8 },
    cancelText: { color: "gray", marginLeft: 8 },
    editRow: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    addRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.light.tint, // 보라색 테두리
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
});