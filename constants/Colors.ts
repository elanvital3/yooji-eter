/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.


const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

 */


export const Colors = {
  light: {
    background: "#FFF",  // 배경색
    primary: "#6750A4",
    text: "#625B71",         // 기본 텍스트 색상
    lightGray: "#FEF7FF",
    // text: "#322F35",         // 기본 텍스트 색상
    // light: "#EADDFF",
    gray: "#B0B0B0",
    secondary: "#625B71",
    info: "#E6E0E9",
    error: "#FFD8E4",
    // gray: "#777",
    subColor: "#F7F3FF",
    tint: "#6A4FB6",         // 보라색
    icon: "#687076",         // 아이콘 색상
    tabIconDefault: "#687076",
    tabIconSelected: "#6A4FB6",
    journalType: "#6A4FB6",  // journalType 색상
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#fff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff",
  },
};