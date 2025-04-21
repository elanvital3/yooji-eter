// 📁 components/BottomTabBar.tsx

import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import { styles } from "../constants/bottomTabStyles";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export default function BottomTabBar() {
    const router = useRouter();
    const segments = useSegments() as string[];
    const isActive = (target: string) => segments.includes(`(${target})`);

    const handleHomePress = async () => {
        const user = auth.currentUser;
        if (!user) {
            router.push("/(auth)");
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
                <Ionicons
                    style={[
                        styles.bottomTabIcon,
                        isActive("main") && styles.activeTabIcon,
                    ]}
                    name="home-outline"
                    size={24}
                />
                <Text
                    style={[
                        styles.bottomTabLabel,
                        isActive("main") && styles.activeTabLabel,
                    ]}
                >
                    홈
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/(journal)")}>
                <MaterialIcons
                    style={[
                        styles.bottomTabIcon,
                        isActive("journal") && styles.activeTabIcon,
                    ]}
                    name="book"
                    size={24}
                />
                <Text
                    style={[
                        styles.bottomTabLabel,
                        isActive("journal") && styles.activeTabLabel,
                    ]}
                >
                    챌린지
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/(friends)")}>
                <Ionicons
                    style={[
                        styles.bottomTabIcon,
                        isActive("friends") && styles.activeTabIcon,
                    ]}
                    name="people-outline"
                    size={24}
                />
                <Text
                    style={[
                        styles.bottomTabLabel,
                        isActive("friends") && styles.activeTabLabel,
                    ]}
                >
                    친구
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabItem} onPress={() => router.push("/(settings)")}>
                <Ionicons
                    style={[
                        styles.bottomTabIcon,
                        isActive("settings") && styles.activeTabIcon,
                    ]}
                    name="settings-outline"
                    size={24}
                />
                <Text
                    style={[
                        styles.bottomTabLabel,
                        isActive("settings") && styles.activeTabLabel,
                    ]}
                >
                    설정
                </Text>
            </TouchableOpacity>
        </View>
    );
}