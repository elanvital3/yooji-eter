import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
} from "react-native";
import { styles } from "../../constants/journalStyles";
import { db, auth } from "../../firebase/config";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

export default function FriendsScreen() {
    const [searchNickname, setSearchNickname] = useState("");
    const [friends, setFriends] = useState<any[]>([]);

    const loadFriends = async () => {
        const user = auth.currentUser;
        if (!user) return;
        const ref = collection(db, `users/${user.uid}/myFriends`);
        const snapshot = await getDocs(ref);
        const data = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
                const friendId = docSnap.id;
                const userSnap = await getDoc(doc(db, "users", friendId));

                // 진행 중인 일기 가져오기
                const journalsQuery = query(
                    collection(db, "journals"),
                    where("userId", "==", friendId),
                    where("status", "==", "in_progress")
                );
                const journalSnap = await getDocs(journalsQuery);
                const journal = journalSnap.docs[0]?.data();

                // 오늘 체크 여부 확인
                let checkedToday = false;
                if (journalSnap.docs[0]) {
                    const todayKey = new Date().toISOString().slice(0, 10);
                    const logSnap = await getDoc(doc(db, `journals/${journalSnap.docs[0].id}/dailyLogs/${todayKey}`));
                    const checklist = logSnap.exists() ? logSnap.data().checklist : [];
                    checkedToday = checklist?.some((item: any) => item.checked);
                }

                return {
                    id: friendId,
                    ...userSnap.data(),
                    journal,
                    checkedToday,
                };
            })
        );
        setFriends(data);
    };

    const handleAddFriend = async () => {
        const user = auth.currentUser;
        if (!user || !searchNickname) return;

        const q = query(collection(db, "users"), where("nickname", "==", searchNickname));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            Alert.alert("찾을 수 없음", "해당 닉네임의 사용자를 찾을 수 없습니다.");
            return;
        }

        const friendDoc = snapshot.docs[0];
        if (friendDoc.id === user.uid) {
            Alert.alert("오류", "자기 자신은 친구로 추가할 수 없습니다.");
            return;
        }

        try {
            await setDoc(doc(db, `users/${user.uid}/myFriends`, friendDoc.id), {
                addedAt: new Date(),
            });
            Alert.alert("추가 완료", `${searchNickname} 님이 친구로 추가되었습니다.`);
            setSearchNickname("");
            loadFriends();
        } catch (err) {
            console.error("추가 실패:", err);
            Alert.alert("오류", "친구 추가 중 문제가 발생했습니다.");
        }
    };

    const handleDeleteFriend = async (friendId: string) => {
        const user = auth.currentUser;
        if (!user) return;

        Alert.alert("삭제 확인", "정말 친구를 삭제하시겠습니까?", [
            { text: "취소", style: "cancel" },
            {
                text: "삭제",
                style: "destructive",
                onPress: async () => {
                    await deleteDoc(doc(db, `users/${user.uid}/myFriends/${friendId}`));
                    loadFriends();
                },
            },
        ]);
    };

    useEffect(() => {
        loadFriends();
    }, []);

    return (
        <View style={styles.journalContainer}>
            <Text style={styles.title}>친구 관리</Text>

            {/* 검색 */}
            <View style={localStyles.searchRow}>
                <TextInput
                    value={searchNickname}
                    onChangeText={setSearchNickname}
                    placeholder="닉네임으로 친구 찾기"
                    style={localStyles.searchInput}
                />
                <TouchableOpacity onPress={handleAddFriend}>
                    <Ionicons name="person-add-outline" size={28} color="#333" />
                </TouchableOpacity>
            </View>

            {/* 친구 카드 */}
            <FlatList
                data={friends}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={localStyles.friendCard}>
                        <View style={localStyles.cardHeader}>
                            <Text style={localStyles.friendName}>{item.nickname}</Text>
                            <TouchableOpacity onPress={() => handleDeleteFriend(item.id)}>
                                <Ionicons name="trash-outline" size={20} color={Colors.light.primary} />
                            </TouchableOpacity>
                        </View>

                        {item.journal ? (
                            <View style={{ marginTop: 6 }}>
                                <Text style={localStyles.infoText}>
                                    제목: {item.journal.title || "(제목 없음)"}
                                </Text>
                                <Text style={localStyles.infoText}>
                                    진행일: {item.journal.period}일 중 {Math.floor((new Date().getTime() - item.journal.startedAt.toDate().getTime()) / (1000 * 60 * 60 * 24)) + 1}일차
                                </Text>
                                <Text style={localStyles.infoText}>
                                    🔥 {item.journal.point || 0} pt | 🌟 {item.journal.perfectCount || 0}
                                </Text>
                                <Text style={localStyles.infoText}>
                                    목표: {item.journal.currentValue} → {item.journal.targetValue}
                                    {item.journal.goalType === "bodyFat" ? "%" : "kg"}
                                </Text>
                                <Text style={[localStyles.infoText, {
                                    color: item.checkedToday ? Colors.light.primary : "gray",
                                }]}>
                                    오늘 체크: {item.checkedToday ? "✅" : "❌"}
                                </Text>
                            </View>
                        ) : (
                            <Text style={{ marginTop: 6, color: "gray" }}>진행 중인 일기 없음</Text>
                        )}
                    </View>
                )}
            />
        </View>
    );
}

const localStyles = StyleSheet.create({
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
        fontFamily: "Pretendard",
    },
    friendCard: {
        backgroundColor: "#f9f9f9",
        padding: 16,
        marginBottom: 12,
        borderRadius: 10,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    friendName: {
        fontSize: 16,
        fontFamily: "Pretendard-Bold",
        color: Colors.light.text,
    },
    infoText: {
        fontSize: 14,
        marginTop: 2,
        fontFamily: "Pretendard",
        color: Colors.light.text,
    },
});