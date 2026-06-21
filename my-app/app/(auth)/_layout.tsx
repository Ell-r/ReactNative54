// app/(auth)/_layout.tsx
import {Redirect, Stack} from "expo-router";
import {useAppSelector} from "@/store";

export default function AuthLayout() {
    const auth = useAppSelector(state => state.auth);

    if (auth) {
        return <Redirect href="/(tabs)/profile" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}