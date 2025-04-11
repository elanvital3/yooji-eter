// 📁 app/(auth)/_layout.tsx
import { Slot } from "expo-router";
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
            <View style={styles.item1}><Text>Item 111111</Text></View>
            <View style={styles.item}><Text>Item 2</Text><Text>Item 2</Text></View>
            <View style={styles.item}><Text>Item 3</Text></View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row', // 수직 정렬 column 이 기본
        // flexWrap: 'wrap', // 자동정렬 nowrap 이면 줄바꿈 없음 
        justifyContent: 'space-between',  // main axis 기본은 start, space-around
        alignItems: 'center', // 수직축 을 어디로 맞출지
        // alignContent: 'space-between', // 아이템들 중심축으로 여러개가 되어 군집이 되었을때 군집간의 거리조절
        padding: 20,

    },
    item: {
        width: 50,
        height: 40,
        // flexGrow: 1, // 남은공간을 얼마나 차지할것인지
        // flexShrink: 1, // 줄어들때 기본값 0 이면 안줄어듬
        flexBasis: '100%', //기본 auth 상태는 grow ,shrink 에 따라 달라지지만 이건 
        backgroundColor: 'skyblue',
        // alignSelf: 'baseline',
        justifyContent: 'center',
        alignItems: 'center',
        // margin: 10,
    },
    item1: {
        width: 120,
        height: 60,
        padding: 10,
        backgroundColor: 'red',
        alignSelf: 'flex-start',
        // justifyContent: 'center',
        // alignItems: 'center',
        // margin: 10,
    },
});