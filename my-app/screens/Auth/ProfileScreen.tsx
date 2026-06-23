import {View, Text, TextInput, Pressable, StyleSheet, Image, ActivityIndicator} from "react-native";
import React, {useEffect, useState} from "react";
import ParallaxScrollView from '@/components/parallax-scroll-view';
import {useAppSelector} from "@/store";
import {useAccountQuery, useEditProfileMutation} from "@/service/AuthService";
import {Redirect, router} from "expo-router";
import {ThemedView} from "@/components/themed-view";
import {loginSuccess, logout} from "@/store/reducers/AuthSlice";
import {LinearGradient} from "expo-linear-gradient";
import {useAppDispatch} from "@/hooks/redux";
import {Ionicons} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import {BASE_URL_IMAGES} from "@/api";


const ProfileScreen = () => {

    const auth = useAppSelector(x => x.auth);
    const {data: account, isLoading, isError, refetch} = useAccountQuery();
    const dispatch = useAppDispatch();
    const [editProfile] = useEditProfileMutation();

    /*useEffect(() => {
        if (!account) {
            router.replace("/login");
        }
    }, [account]);*/

    if (auth == null){
        return <Redirect href="/login" />;
    }

    const handleUpdate = async () =>{
        await refetch();
        //console.log(auth);
    }

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("accessToken");
        dispatch(logout());
        router.replace("/login");
    }

    const handleEditInfo = () =>{
        router.push("/profile/edit");
    }

    const handleSetPhoto = async () =>{
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Доступ до галереї потрібен для вибору фото.");
            return;
        }

        console.log(`${BASE_URL_IMAGES}/1200_${account?.image}`);

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];

            const newImageFile = {
                uri: asset.uri,
                name: "avatar.jpg",
                type: "image/jpeg",
            }

            try{

                const name = account?.fullName?.trim().split(" ") ?? [];
                console.log("name", name[0]);

                const sendData = {
                    firstName: name[0] || " ",
                    lastName: name.slice(1).join(" ") || " ",
                    email: account.email,
                    imageFile: newImageFile
                }

                const result = await editProfile(sendData).unwrap();

                if (result.token){
                    console.log(result.token);
                    dispatch(loginSuccess(result.token));
                    await SecureStore.setItemAsync('accessToken',  result.token);
                    await refetch();
                }
            }
            catch(error: any){
                console.error("Error: ", error);

                if (error?.data) {
                    console.log(error.data);
                }
            }

        }
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
                        <View style={{ flex: 1 }}>
                            <Image
                                source={{ uri: `${BASE_URL_IMAGES}/1200_${account?.image}` }}
                                style={styles.profileImage}
                            />

                            <View style={{
                                position: "absolute",
                                bottom: 20,
                                left: 20,
                            }}>
                                <Text className={"font-bold color-white text-3xl"}>{account?.fullName}</Text>

                                <Text className={"text-gray-400"}>{account?.email}</Text>
                            </View>
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
        height: '100%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
});

export default ProfileScreen;