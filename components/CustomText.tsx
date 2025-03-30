// 📁 components/CustomText.tsx
import { Text, TextProps, TextStyle } from "react-native";

export default function CustomText(props: TextProps) {
    return (
        <Text
            {...props}
            style={[{ fontFamily: "PretendardBold" }, props.style as TextStyle]}
        />
    );
}