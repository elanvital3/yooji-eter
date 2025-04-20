// 📁 hooks/useVersionCheck.ts
import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import * as Application from 'expo-application';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

function compareVersions(current: string, latest: string) {
    return current !== latest;
}

export function useVersionCheck() {
    useEffect(() => {
        const checkVersion = async () => {
            try {
                const ref = doc(db, 'appConfig', 'android');
                const snap = await getDoc(ref);

                if (snap.exists()) {
                    const { latestVersion, updateUrl } = snap.data();
                    const currentVersion = Application.nativeApplicationVersion ?? "0.0.0";

                    if (compareVersions(currentVersion, latestVersion)) {
                        Alert.alert(
                            '업데이트 필요',
                            '새 버전이 출시되었습니다. 지금 업데이트 하시겠어요?',
                            [
                                { text: '나중에', style: 'cancel' },
                                { text: '업데이트', onPress: () => Linking.openURL(updateUrl) }
                            ]
                        );
                    }
                }
            } catch (err) {
                console.log('버전 확인 실패:', err);
            }
        };

        checkVersion();
    }, []);
}
