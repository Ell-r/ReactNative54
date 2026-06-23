import {
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Animated,
    ActivityIndicator
} from "react-native";
import {Controller, useForm} from "react-hook-form";
import {IEditProfileModel} from "@/models/User/IEditProfileModel";
import ScrollView = Animated.ScrollView;
import {LinearGradient} from "expo-linear-gradient";
import {useAppSelector} from "@/store";
import {useAccountQuery, useEditProfileMutation} from "@/service/AuthService";
import {useAppDispatch} from "@/hooks/redux";
import {Redirect, router} from "expo-router";
import {loginSuccess, logout} from "@/store/reducers/AuthSlice";
import * as SecureStore from 'expo-secure-store';
import {ThemedView} from "@/components/themed-view";
import React, {useEffect, useState} from "react";

const EditProfileScreen = () => {
    const {control, handleSubmit, reset} = useForm<IEditProfileModel>();

    const auth = useAppSelector(x => x.auth);
    const {data: account, isLoading, isError, refetch} = useAccountQuery();
    const dispatch = useAppDispatch();
    const [editProfile] = useEditProfileMutation();
    const [serverError, setServerError] = useState("")

    useEffect(() => {
        if (account) {
            const [firstName, ...lastNameArr] = account.fullName?.split(" ") ?? [];

            reset({
                firstName: firstName ?? "",
                lastName: lastNameArr.join(" ") ?? "",
                email: account.email ?? "",
            });
        }
    }, [account]);

    const onSubmit = async (data: IEditProfileModel) => {
        try{

            const sendData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                imageFile: undefined
            }

            const result = await editProfile(sendData).unwrap();

            if (result.token){
                console.log(result.token);
                dispatch(loginSuccess(result.token));
                await SecureStore.setItemAsync('accessToken',  result.token);
                await refetch();
                router.replace("/profile");
            }
        }
        catch(error: any){
            console.error("Error: ", error);

            if (error?.data) {
                setServerError(error.data);
                console.log(error.data);
            }

            else if (error?.status === 'FETCH_ERROR') {
                setServerError("There is no connection to the server. Check the internet.");
            }
            else{
                setServerError("Unknown error. Try again later.");
            }
        }
    }

    const handleUpdate = async () =>{
        await refetch();
    }

    if (auth == null){
        return <Redirect href="/login" />;
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


            {auth && (
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
                >

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            paddingBottom: 80,
                            flexGrow: 1,
                        }}
                    >

                        <View className="flex flex-column p-2 bg-white rounded-xl m-2">
                            <Text className={"ms-4 font-bold"} style =  {{
                                color: "#8276f8",
                            }}>Your name</Text>

                            <Controller control={control}
                                        name = "firstName"
                                        rules={{ required: "Firstname is required" }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                placeholder="Firstname"
                                                value={value}
                                                onChangeText={onChange}
                                                className={"w-96 p-5 color-black mt-3"}
                                            />
                                        )}/>

                            <Controller control={control}
                                        name = "lastName"
                                        rules={{ required: "Lastname is required" }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                placeholder="Lastname"
                                                value={value}
                                                onChangeText={onChange}
                                                className={"w-96 p-5 color-black mt-3"}
                                            />
                                        )}/>

                        </View>

                        <View className="flex flex-column p-2 bg-white rounded-xl m-2">
                            <Text className={"ms-4 font-bold"} style =  {{
                                color: "#8276f8",
                            }}>Your info</Text>

                            <Controller control={control}
                                        name = "email"
                                        rules={{ required: "Email is required" }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                placeholder="Email"
                                                value={value}
                                                onChangeText={onChange}
                                                className={"w-96 p-5 color-black mt-3"}
                                            />
                                        )}/>

                        </View>

                        <Pressable className={"p-2"} onPress={() => handleSubmit(onSubmit)()}>
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
                                    Save changes
                                </Text>
                            </LinearGradient>
                        </Pressable>
                        {serverError && (
                            <Text className="text-red-700 text-sm font-medium mt-1">
                                {serverError}
                            </Text>
                        )}

                    </ScrollView>
                </KeyboardAvoidingView>
            )}

        </>
    )
}

export default EditProfileScreen