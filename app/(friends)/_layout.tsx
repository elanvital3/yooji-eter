// 📁 app/(friends)/_layout.tsx

import { Slot } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { styles } from "../../constants/journalStyles";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import BottomTabBar from "../../components/BottomTabBar";
import { format } from "date-fns";

export default function FriendsLayout() {
    const [nickname, setNickname] = useState<string | null>(null);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setNickname(userSnap.data().nickname);
                }
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/(auth)");
        } catch (err) {
            console.error("로그아웃 실패:", err);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity style={styles.topContainer} onPress={() => setIsMenuVisible(!isMenuVisible)}>
                <Text style={styles.nickName}>{nickname}</Text>
                <Text style={styles.menuText}> ⋮</Text>
            </TouchableOpacity>

            {isMenuVisible && (
                <>
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 10,
                        }}
                        activeOpacity={1}
                        onPress={() => setIsMenuVisible(false)}
                    />

                    <View style={[styles.dropdownMenu, { zIndex: 11 }]}>
                        <TouchableOpacity
                            style={styles.topMenu1}
                            onPress={async () => {
                                setIsMenuVisible(false);
                                await handleLogout();
                            }}
                        >
                            <Text style={styles.menuDetail}>로그아웃</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.topMenu2}
                            onPress={() => {
                                setIsMenuVisible(false);
                                console.log("📌 다른 옵션 선택됨");
                            }}
                        >
                            <Text style={styles.menuDetail}>다른옵션</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            <View style={styles.subContainer}>
                <Slot />
            </View>

            <BottomTabBar />
        </View>
    );
}