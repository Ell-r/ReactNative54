import {View, Text, TextInput, Pressable, StyleSheet, Image, ActivityIndicator} from "react-native";
import React, {useEffect} from "react";
import ParallaxScrollView from '@/components/parallax-scroll-view';
import {useAppSelector} from "@/store";
import {useAccountQuery} from "@/service/AuthService";
import {Redirect, router} from "expo-router";
import {ThemedView} from "@/components/themed-view";
import {logout} from "@/store/reducers/AuthSlice";
import {LinearGradient} from "expo-linear-gradient";
import {useAppDispatch} from "@/hooks/redux";
import {Ionicons} from "@expo/vector-icons";


const ProfileScreen = () => {

    const auth = useAppSelector(x => x.auth);
    const {data: account, isLoading, isError, refetch} = useAccountQuery();
    const dispatch = useAppDispatch();

    if (auth == null){
        return <Redirect href="/login" />;
    }

    const handleUpdate = async () =>{
        await refetch();
        //console.log(auth);
    }

    const handleLogout = () => {
        dispatch(logout());
        router.replace("/login");
    }

    const handleEditInfo = () =>{
        router.push("/profile/edit");
    }

    const handleSetPhoto = () =>{
        //router.push("/profile/setPhoto");
        console.log("Setting photo");
    }

    return(
        <>
            {isError && (
                <View className="flex-1 justify-center items-center gap-2 w-full px-6">

                    <Text className="text-2xl text-center">
                        Something went wrong.
                    </Text>

                    <Text className="text-center">
                        We cant load your profile. Try again
                    </Text>

                    <Pressable
                        onPress={() => handleUpdate()}
                        style={{ width: "50%" }}
                        className="mt-2 w-75 rounded-xl overflow-hidden"
                    >
                        <LinearGradient
                            colors={['#3127e8', '#8276f8']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                paddingVertical: 12,
                                borderRadius: 24,
                                alignItems: "center",
                            }}
                        >
                            <Text className="text-white font-semibold text-lg">
                                Update
                            </Text>
                        </LinearGradient>
                    </Pressable>

                </View>
            )}

            {isLoading && (
                <View className="flex-1 flex-column gap-4 items-center my-11">
                    <ThemedView className="flex-1 items-center justify-center py-10">
                        <ActivityIndicator size="large" />
                    </ThemedView>
                </View>
            )}

            {account && (
                <ParallaxScrollView
                    headerBackgroundColor={{ light: '#cccdf8', dark: '#3127e8' }}
                    headerImage={
                        <View style={{
                            position: "absolute",
                            bottom: 20,
                            left: 20,
                        }}>
                            <Image
                                source={{ uri: account?.image }}
                                style={styles.profileImage}
                            />

                            <Text className={"text-3xl font-bold text-white"}>{account?.fullName}</Text>
                            <Text className={"text-gray-400"}>{account?.email}</Text>
                        </View>
                    }>

                    <View className="flex flex-row gap-2">
                        <Pressable
                            onPress={() => handleSetPhoto()}
                            style={{ width: "49%" }}
                            className="mt-2 w-75 rounded-xl overflow-hidden"
                        >
                            <LinearGradient
                                colors={['#8276f8', '#8276f8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    paddingVertical: 12,
                                    borderRadius: 16,
                                    alignItems: "center",
                                }}
                            >
                                <Ionicons name={"camera"} size={24} color={'white'} />
                                <Text className="text-white font-semibold">
                                    Set Photo
                                </Text>
                            </LinearGradient>
                        </Pressable>

                        <Pressable
                            onPress={() => handleEditInfo()}
                            style={{ width: "49%" }}
                            className="mt-2 w-75 rounded-xl overflow-hidden"
                        >
                            <LinearGradient
                                colors={['#8276f8', '#8276f8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    paddingVertical: 12,
                                    borderRadius: 16,
                                    alignItems: "center",
                                }}
                            >
                                <Ionicons name="create-outline" size={24} color="white" />
                                <Text className="text-white font-semibold">
                                    Edit info
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </View>

                    <Pressable onPress={() => handleLogout()}>
                        <LinearGradient
                            colors={['#3127e8', 'rgb(212,141,253)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                paddingVertical: 16,
                                borderRadius: 12,
                                alignItems: 'center',
                                marginTop: 12,
                                width: '100%',
                                overflow: 'hidden',
                            }}
                        >
                            <Text className="text-white font-semibold text-lg">
                                Logout
                            </Text>
                        </LinearGradient>
                    </Pressable>

                </ParallaxScrollView>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    profileImage: {
        height: 230,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
});

export default ProfileScreen;