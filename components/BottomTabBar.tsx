// 📁 components/BottomTabBar.tsx

import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from "../constants/bottomTabStyles";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export default function BottomTabBar() {
    const router = useRouter();

    const handleHomePress = async () => {
        const user = auth.currentUser;
        if (!user) {
            router.push("/(auth)"); // 로그인 안 돼있으면 로그인으로
            return;
        }

        const q = query(
            collection(db, "journals"),
            where("userId", "==", user.uid),
            where("status", "==", "in_progress")
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            router.push({
                pathname: "/(main)",
                params: { journalId: doc.id },
            });
        } else {
            router.push("/(journal)");
        }
    };

    return (
        <View style={styles.bottomTabContainer}>
            <TouchableOpacity style={styles.tabItem} onPress={handleHomePress}>
                <Ionicons style={styles.bottomTabIcon} name="home-outline" size={24} />
                <Text style={styles.bottomTabLabel}>홈</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/(journal)")}>
                <MaterialIcons style={styles.bottomTabIcon} name="book" size={24} />
                <Text style={styles.bottomTabLabel}>저널</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/(settings)")}>
                <Ionicons style={styles.bottomTabIcon} name="settings-outline" size={24} />
                <Text style={styles.bottomTabLabel}>설정</Text>
            </TouchableOpacity>
        </View>
    );
}