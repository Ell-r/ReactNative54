import {Pressable, Text} from "react-native";

const AuthTab = ({
                                    label,
                                    onPress,
                                    className,
                 } :{
    label: string;
    className: string;
    onPress: () => void;
}) =>{
    return(
        <Pressable
            onPress={onPress}
            className={className}
        >
            <Text className="text-white font-semibold">
                {label}
            </Text>
        </Pressable>
    )
}

export default AuthTab;